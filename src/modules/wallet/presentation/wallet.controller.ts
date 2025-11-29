import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessResponseDTO } from 'src/common/dto/success-response.dto';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { JwtAuthGuard } from 'src/modules/auth/presentation/jwt-auth.guard';
import { WalletResponseDTO } from '../application/dto/wallet-response.dto';
import { WalletTransactionDTO } from '../application/dto/wallet-transaction.dto';
import { WalletService } from '../application/wallet.service';

@ApiTags('Wallet')
@Controller('wallets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiOperation({ summary: 'Get current user wallet details' })
  @ApiResponse({
    status: 200,
    description: 'Get current user wallet details',
    type: WalletResponseDTO,
  })
  @Get('me')
  async getMyWallet(@Request() req: AuthenticatedRequest) {
    const wallet = await this.walletService.getWallet(req.user.id);
    return { message: 'Wallet retrieved successfully', data: wallet };
  }
  @ApiOperation({ summary: 'Top up wallet' })
  @ApiResponse({
    status: 201,
    description: 'Wallet topped up successfully',
    type: SuccessResponseDTO,
  })
  @Post('top-up')
  async topUp(@Request() req: AuthenticatedRequest, @Body() body: WalletTransactionDTO) {
    await this.walletService.topUp(req.user.id, body.amountCents);
    return { message: 'Wallet topped up successfully' };
  }

  @ApiOperation({ summary: 'Withdraw funds from wallet' })
  @ApiResponse({
    status: 201,
    description: 'Funds withdrawn successfully',
    type: SuccessResponseDTO,
  })
  @Post('withdraw')
  async withdraw(@Request() req: AuthenticatedRequest, @Body() body: WalletTransactionDTO) {
    await this.walletService.withdraw(req.user.id, body.amountCents);
    return { message: 'Funds withdrawn successfully' };
  }

  @ApiOperation({ summary: 'Get wallet transactions' })
  @ApiResponse({
    status: 200,
    description: 'Wallet transactions retrieved successfully',
  })
  @Get('transactions')
  async getTransactions(@Request() req: AuthenticatedRequest) {
    const transactions = await this.walletService.getTransactions(req.user.id);
    return { message: 'Transactions retrieved successfully', data: transactions };
  }
}
