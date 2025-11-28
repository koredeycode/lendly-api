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
}
