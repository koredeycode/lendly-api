import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { IdempotencyGuard } from 'src/common/guards/idempotency.guard';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { JwtAuthGuard } from 'src/modules/auth/presentation/jwt-auth.guard';
import {
  PaymentCallbackDto,
  TopUpDto,
  TopUpResponseDto,
  VerifyPaymentDto,
  VerifyResponseDto,
  WithdrawDto,
  WithdrawResponseDto
} from '../application/dto/payment.dto';
import { PaymentService } from '../application/payment.service';

@ApiTags('Payment')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: 'Initialize wallet top-up' })
  @ApiResponse({
    status: 201,
    description: 'Top-up initialized',
    type: TopUpResponseDto,
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Idempotency-Key',
    description: 'Unique key for idempotency',
    required: true,
  })
  @UseGuards(JwtAuthGuard, IdempotencyGuard)
  @Post('top-up')
  async topUp(@Request() req: AuthenticatedRequest, @Body() body: TopUpDto) {
    const response = await this.paymentService.initializeTopUp(
      req.user.id,
      body.amountCents,
      body.email,
      body.platform,
    );
    return { message: 'Top-up initialized', data: response };
  }

  @ApiOperation({ summary: 'Verify payment transaction' })
  @ApiResponse({
    status: 200,
    description: 'Transaction verified',
    type: VerifyResponseDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('verify')
  async verify(@Query() query: VerifyPaymentDto) {
    const transaction = await this.paymentService.verifyTransaction(
      query.reference,
    );
    return { message: 'Transaction verified', data: transaction };
  }

  @ApiOperation({ summary: 'Request withdrawal' })
  @ApiResponse({
    status: 201,
    description: 'Withdrawal requested',
    type: WithdrawResponseDto,
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Idempotency-Key',
    description: 'Unique key for idempotency',
    required: true,
  })
  @UseGuards(JwtAuthGuard, IdempotencyGuard)
  @Post('withdraw')
  async withdraw(
    @Request() req: AuthenticatedRequest,
    @Body() body: WithdrawDto,
  ) {
    const transaction = await this.paymentService.requestWithdrawal(
      req.user.id,
      body.amountCents,
      body.accountDetails,
    );
    return { message: 'Withdrawal requested', data: transaction };
  }
  
  @ApiOperation({ summary: 'Handle payment webhook' })
  @ApiResponse({
    status: 200,
    description: 'Webhook handled',
  })
  @Post('webhook/:provider')
  async handleWebhook(
    @Param('provider') provider: string,
    @Body() body: any,
    @Request() req: any,
  ) {
    const signature =
      req.headers['x-paystack-signature'] || req.headers['stripe-signature'];
    return await this.paymentService.handleWebhook(provider, body, signature);
  }
  
  @ApiOperation({ summary: 'Handle payment callback' })
  @ApiResponse({
    status: 302,
    description: 'Redirect to app',
  })
  @Get('callback')
  @Get('callback')
  async handleCallback(@Query() query: PaymentCallbackDto, @Res() res: Response) {
    const { reference, trxref, platform } = query;
    const ref = reference || trxref;

    if (platform === 'web') {
      // Redirect to web frontend
      const webUrl = `${process.env.WEB_URL || 'https://lendly.app'}/payment/callback?reference=${ref}`;
      return res.redirect(webUrl);
    } else {
      // Redirect to mobile app (ios/android)
      // We can differentiate ios/android if needed, but for now both use same scheme
      const appUrl = `lendy://wallet?reference=${ref}`;
      return res.redirect(appUrl);
    }
  }
}
