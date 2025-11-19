import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { WalletService } from '../application/wallet.service';

@ApiTags('Wallet')
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiResponse({
    status: 200,
    description: 'Wallet endpoint',
  })
  @Get('/hello')
  hello() {
    return { message: 'Hello from wallet endpoint' };
  }
}
