import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { JwtAuthGuard } from 'src/modules/auth/presentation/jwt-auth.guard';
import {
  TopUpDto,
  TopUpResponseDto,
  VerifyPaymentDto,
  VerifyResponseDto,
  WithdrawDto,
  WithdrawResponseDto,
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
  @UseGuards(JwtAuthGuard)
  @Post('top-up')
  async topUp(@Request() req: AuthenticatedRequest, @Body() body: TopUpDto) {
    const response = await this.paymentService.initializeTopUp(
      req.user.id,
      body.amountCents,
      body.email,
      body.callbackUrl,
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
  @UseGuards(JwtAuthGuard)
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
}
