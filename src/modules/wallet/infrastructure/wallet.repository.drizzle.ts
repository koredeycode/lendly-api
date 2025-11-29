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
  async holdFunds(
    userId: string,
    amountCents: number,
    bookingId: string | null,
    tx?: any,
  ) {
    const database = tx || db;
    const [wallet] = await database
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);

    if (!wallet || wallet.availableBalanceCents < amountCents) {
      throw new Error('Insufficient funds');
    }

    await database
      .update(wallets)
      .set({
        availableBalanceCents: sql`${wallets.availableBalanceCents} - ${amountCents}`,
        frozenBalanceCents: sql`${wallets.frozenBalanceCents} + ${amountCents}`,
        updatedAt: new Date(),
      })
      .where(eq(wallets.userId, userId));

    await this.addWalletTransaction({
      walletId: wallet.id,
      amountCents: -amountCents,
      type: 'hold',
      bookingId,
      description: 'Funds held for booking',
    });
  }

  async releaseFunds(
    userId: string,
    amountCents: number,
    bookingId: string | null,
    tx?: any,
  ) {
    const database = tx || db;
    const wallet = await this.getWallet(userId);
    if (!wallet) {
      throw new Error('Wallet not found');
    }

    await database
      .update(wallets)
      .set({
        availableBalanceCents: sql`${wallets.availableBalanceCents} + ${amountCents}`,
        frozenBalanceCents: sql`${wallets.frozenBalanceCents} - ${amountCents}`,
        updatedAt: new Date(),
      })
      .where(eq(wallets.userId, userId));

    await this.addWalletTransaction({
      walletId: userId,
      amountCents,
      type: 'release',
      bookingId,
      description: 'Funds released from hold',
    });
  }

  async transferFunds(
    fromUserId: string,
    toUserId: string,
    amountCents: number,
    bookingId: string,
    tx?: any,
  ) {
    const database = tx || db;
    // Deduct from sender's frozen balance
    await database
      .update(wallets)
      .set({
        frozenBalanceCents: sql`${wallets.frozenBalanceCents} - ${amountCents}`,
        updatedAt: new Date(),
      })
      .where(eq(wallets.userId, fromUserId));

    // Add to receiver's available balance
    await database
      .update(wallets)
      .set({
        availableBalanceCents: sql`${wallets.availableBalanceCents} + ${amountCents}`,
        updatedAt: new Date(),
      })
      .where(eq(wallets.userId, toUserId));

    // Record transactions
    const fromWallet = await this.getWallet(fromUserId);
    const toWallet = await this.getWallet(toUserId);

    if (!fromWallet || !toWallet) {
      throw new Error('One or both wallets not found during transfer');
    }

    await this.addWalletTransaction({
      walletId: fromUserId,
      amountCents: -amountCents,
      type: 'rental_payment',
      bookingId,
      description: 'Payment for booking',
    });

    await this.addWalletTransaction({
      walletId: toUserId,
      amountCents,
      type: 'rental_receive',
      bookingId,
      description: 'Payment received for booking',
    });
  }
  async topUp(userId: string, amountCents: number) {
    await db.transaction(async (tx) => {
      await tx
        .update(wallets)
        .set({
          availableBalanceCents: sql`${wallets.availableBalanceCents} + ${amountCents}`,
          updatedAt: new Date(),
        })
        .where(eq(wallets.userId, userId));

      await this.addWalletTransaction({
        walletId: userId,
        amountCents,
        type: 'top_up',
        description: 'Wallet top-up',
      });
    });
  }

  async withdraw(userId: string, amountCents: number) {
    await db.transaction(async (tx) => {
      const wallet = await this.getWallet(userId);
      if (wallet.availableBalanceCents < amountCents) {
        throw new Error('Insufficient funds');
      }

      await tx
        .update(wallets)
        .set({
          availableBalanceCents: sql`${wallets.availableBalanceCents} - ${amountCents}`,
          updatedAt: new Date(),
        })
        .where(eq(wallets.userId, userId));

      await this.addWalletTransaction({
        walletId: userId,
        amountCents: -amountCents,
        type: 'withdrawal',
        description: 'Wallet withdrawal',
      });
    });
  }
}
