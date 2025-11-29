import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/presentation/jwt-auth.guard';
import { PaymentService } from '../application/payment.service';
import { TopUpDto, VerifyPaymentDto, WithdrawDto } from './dto/payment.dto';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({ summary: 'Initialize wallet top-up' })
  @ApiResponse({ status: 201, description: 'Top-up initialized' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('top-up')
  async topUp(@Request() req, @Body() body: TopUpDto) {
    const response = await this.paymentService.initializeTopUp(
      req.user.id,
      body.amountCents,
      body.email,
      body.callbackUrl,
    );
    return { message: 'Top-up initialized', data: response };
  }

  @ApiOperation({ summary: 'Verify payment transaction' })
  @ApiResponse({ status: 200, description: 'Transaction verified' })
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
  @ApiResponse({ status: 201, description: 'Withdrawal requested' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('withdraw')
  async withdraw(@Request() req, @Body() body: WithdrawDto) {
    const transaction = await this.paymentService.requestWithdrawal(
      req.user.id,
      body.amountCents,
      body.accountDetails,
    );
    return { message: 'Withdrawal requested', data: transaction };
  }

}
