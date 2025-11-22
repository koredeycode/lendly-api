import { Injectable } from '@nestjs/common';
import { WalletRepository } from '../domain/wallet.repository';

@Injectable()
export class WalletService {
  constructor(private readonly walletRepo: WalletRepository) {}

  async getWallet(id: string) {
    const wallet = await this.walletRepo.getWallet(id);
    // return wallet;
    return { balance: 'money' };
  }
}
