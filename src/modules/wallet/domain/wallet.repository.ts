import { walletTransactionTypeEnum } from '@koredeycode/lendly-types';

export abstract class WalletRepository {
  abstract getWallet(userId: string);
  abstract createWalletIfNotExists(userId: string);
  abstract addWalletTransaction(data: {
    walletId: string;
    amountCents: number;
    type: (typeof walletTransactionTypeEnum.enumValues)[number];
    bookingId?: string | null;
    description?: string;
  });
}
