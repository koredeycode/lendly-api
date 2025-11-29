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
  async holdFunds(
    userId: string,
    amountCents: number,
    bookingId: string | null,
    tx?: any,
  ) {
    await this.walletRepo.holdFunds(userId, amountCents, bookingId, tx);
  }

  async releaseFunds(
    userId: string,
    amountCents: number,
    bookingId: string | null,
    tx?: any,
  ) {
    await this.walletRepo.releaseFunds(userId, amountCents, bookingId, tx);
  }

  async transferFunds(
    fromUserId: string,
    toUserId: string,
    amountCents: number,
    bookingId: string,
    tx?: any,
  ) {
    await this.walletRepo.transferFunds(
      fromUserId,
      toUserId,
      amountCents,
      bookingId,
      tx,
    );
  }
  async topUp(userId: string, amountCents: number) {
    await this.walletRepo.topUp(userId, amountCents);
  }

  async withdraw(userId: string, amountCents: number) {
    await this.walletRepo.withdraw(userId, amountCents);
  }
}
