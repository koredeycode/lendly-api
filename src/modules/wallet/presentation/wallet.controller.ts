import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/presentation/jwt-auth.guard';
import { WalletService } from '../application/wallet.service';

@ApiTags('Wallet')
@Controller('wallets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiResponse({
    status: 200,
    description: 'Get current user wallet details',
  })
  @Get('me')
  async getMyWallet(@Request() req) {
    const wallet = await this.walletService.getWallet(req.user.id);
    return { message: 'Wallet retrieved successfully', data: wallet };
  }
}
