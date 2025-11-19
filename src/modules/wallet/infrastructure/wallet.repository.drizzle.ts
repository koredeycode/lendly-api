import { walletTransactionTypeEnum } from '@koredeycode/lendly-types';
import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { db } from 'src/config/db/drizzle/client';
import { wallets, walletTransactions } from 'src/config/db/schema';
import { WalletRepository } from '../domain/wallet.repository';

@Injectable()
export class DrizzleWalletRepository implements WalletRepository {
  async getWallet(userId: string) {
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);
    return wallet ?? null;
  }

  async createWalletIfNotExists(userId: string) {
    return await db
      .insert(wallets)
      .values({ userId })
      .onConflictDoNothing()
      .returning();
  }

  async addWalletTransaction(data: {
    walletId: string;
    amountCents: number;
    type: (typeof walletTransactionTypeEnum.enumValues)[number];
    bookingId?: string | null;
    description?: string;
  }) {
    return await db.transaction(async (tx) => {
      const [txRecord] = await tx
        .insert(walletTransactions)
        .values(data)
        .returning();

      await tx
        .update(wallets)
        .set({
          balanceCents: sql`${wallets.balanceCents} + ${data.amountCents}`,
          updatedAt: new Date(),
        })
        .where(eq(wallets.userId, data.walletId));

      return txRecord;
    });
  }
}
