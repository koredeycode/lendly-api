import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { db } from 'src/config/db/drizzle/client';
import { wallets, walletTransactions, walletTransactionTypeEnum } from 'src/config/db/schema';
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
          availableBalanceCents: sql`${wallets.availableBalanceCents} + ${data.amountCents}`,
          updatedAt: new Date(),
        })
        .where(eq(wallets.userId, data.walletId));

      return txRecord;
    });
  }
  async holdFunds(userId: string, amountCents: number, bookingId: string | null) {
    await db.transaction(async (tx) => {
      const [wallet] = await tx
        .select()
        .from(wallets)
        .where(eq(wallets.userId, userId))
        .limit(1);

      if (!wallet || wallet.availableBalanceCents < amountCents) {
        throw new Error('Insufficient funds');
      }

      await tx
        .update(wallets)
        .set({
          availableBalanceCents: sql`${wallets.availableBalanceCents} - ${amountCents}`,
          frozenBalanceCents: sql`${wallets.frozenBalanceCents} + ${amountCents}`,
          updatedAt: new Date(),
        })
        .where(eq(wallets.userId, userId));

      await tx.insert(walletTransactions).values({
        walletId: userId,
        amountCents: -amountCents,
        type: 'hold',
        bookingId,
        description: 'Funds held for booking request',
      });
    });
  }

  async releaseFunds(userId: string, amountCents: number, bookingId: string | null) {
    await db.transaction(async (tx) => {
      await tx
        .update(wallets)
        .set({
          availableBalanceCents: sql`${wallets.availableBalanceCents} + ${amountCents}`,
          frozenBalanceCents: sql`${wallets.frozenBalanceCents} - ${amountCents}`,
          updatedAt: new Date(),
        })
        .where(eq(wallets.userId, userId));

      await tx.insert(walletTransactions).values({
        walletId: userId,
        amountCents: amountCents,
        type: 'release',
        bookingId,
        description: 'Funds released from hold',
      });
    });
  }

  async transferFunds(
    fromUserId: string,
    toUserId: string,
    amountCents: number,
    bookingId: string,
  ) {
    await db.transaction(async (tx) => {
      // Deduct from borrower (frozen)
      await tx
        .update(wallets)
        .set({
          frozenBalanceCents: sql`${wallets.frozenBalanceCents} - ${amountCents}`,
          updatedAt: new Date(),
        })
        .where(eq(wallets.userId, fromUserId));

      await tx.insert(walletTransactions).values({
        walletId: fromUserId,
        amountCents: -amountCents,
        type: 'rental_payment',
        bookingId,
        description: 'Payment for booking',
      });

      // Credit to lender (available)
      await tx
        .update(wallets)
        .set({
          availableBalanceCents: sql`${wallets.availableBalanceCents} + ${amountCents}`,
          updatedAt: new Date(),
        })
        .where(eq(wallets.userId, toUserId));

      await tx.insert(walletTransactions).values({
        walletId: toUserId,
        amountCents: amountCents,
        type: 'rental_receive',
        bookingId,
        description: 'Payment received for booking',
      });
    });
  }
}
