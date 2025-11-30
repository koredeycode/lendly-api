import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { JwtAuthGuard } from 'src/modules/auth/presentation/jwt-auth.guard';
import { WalletResponseDTO } from '../application/dto/wallet-response.dto';
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

  @ApiOperation({ summary: 'Get wallet transactions' })
  @ApiResponse({
    status: 200,
    description: 'Wallet transactions retrieved successfully',
  })
  @Get('transactions')
  async getTransactions(@Request() req: AuthenticatedRequest) {
    const transactions = await this.walletService.getTransactions(req.user.id);
    return {
      message: 'Transactions retrieved successfully',
      data: transactions,
    };
  }
}
