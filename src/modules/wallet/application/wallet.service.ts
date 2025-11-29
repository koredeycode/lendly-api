import { Injectable } from '@nestjs/common';
import { WalletRepository } from '../domain/wallet.repository';

@Injectable()
export class WalletService {
  constructor(private readonly walletRepo: WalletRepository) {}

  async getWallet(userId: string) {
    const wallet = await this.walletRepo.getWallet(userId);
    // if (!wallet) {
    //   wallet = await this.walletRepo.createWalletIfNotExists(userId);
    // }
    return wallet;
  }

  async createWallet(userId: string) {
    return await this.walletRepo.createWalletIfNotExists(userId);
  }
  async holdFunds(userId: string, amountCents: number, bookingId: string | null) {
    await this.walletRepo.holdFunds(userId, amountCents, bookingId);
  }

  async releaseFunds(userId: string, amountCents: number, bookingId: string | null) {
    await this.walletRepo.releaseFunds(userId, amountCents, bookingId);
  }

  async transferFunds(
    fromUserId: string,
    toUserId: string,
    amountCents: number,
    bookingId: string,
  ) {
    await this.walletRepo.transferFunds(
      fromUserId,
      toUserId,
      amountCents,
      bookingId,
    );
  }
}
