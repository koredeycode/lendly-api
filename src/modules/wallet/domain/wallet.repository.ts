import { Wallet, walletTransactionTypeEnum } from 'src/config/db/schema';

export abstract class WalletRepository {
  abstract getWallet(userId: string): Promise<Wallet>;
  abstract createWalletIfNotExists(userId: string);
  abstract addWalletTransaction(data: {
    walletId: string;
    amountCents: number;
    type: (typeof walletTransactionTypeEnum.enumValues)[number];
    bookingId?: string | null;
    description?: string;
  });
  
  abstract holdFunds(
    userId: string,
    amountCents: number,
    bookingId: string | null
  ): Promise<void>;

  abstract releaseFunds(
    userId: string,
    amountCents: number,
    bookingId: string | null
  ): Promise<void>;

  abstract transferFunds(
    fromUserId: string,
    toUserId: string,
    amountCents: number,
    bookingId: string
  ): Promise<void>;
}
