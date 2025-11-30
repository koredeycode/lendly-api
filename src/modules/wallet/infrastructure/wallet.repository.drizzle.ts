import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { and, desc, eq, gte, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/config/db/schema';
import {
    wallets,
    walletTransactions,
    walletTransactionTypeEnum,
} from 'src/config/db/schema';
import { DRIZZLE } from 'src/modules/database/database.constants';
import { WalletRepository } from '../domain/wallet.repository';

@Injectable()
export class DrizzleWalletRepository implements WalletRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>) {}

  async getWallet(userId: string) {
    const [wallet] = await this.db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);
    return wallet ?? null;
  }

  async createWalletIfNotExists(userId: string) {
    return await this.db
      .insert(wallets)
      .values({ userId })
      .onConflictDoNothing()
      .returning();
  }

  async addWalletTransaction(
    data: {
      walletId: string;
      amountCents: number;
      type: (typeof walletTransactionTypeEnum.enumValues)[number];
      bookingId?: string | null;
      description?: string;
    },
    tx?: any,
  ) {
    const runInTransaction = async (transaction: any) => {
      const [txRecord] = await transaction
        .insert(walletTransactions)
        .values(data)
        .returning();

      return txRecord;
    };

    if (tx) {
      return await runInTransaction(tx);
    } else {
      return await this.db.transaction(runInTransaction);
    }
  }

  async holdFunds(
    userId: string,
    amountCents: number,
    bookingId: string | null,
    tx?: any,
  ) {
    console.log('Holding funds for user', userId);
    const database = tx || this.db;
    const [wallet] = await database
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId))
      .limit(1);

    if (!wallet || wallet.availableBalanceCents < amountCents) {
      throw new BadRequestException('Insufficient funds');
    }

    const amount = Number(amountCents);
    console.log('Holding funds:', {
      userId,
      amount,
      type: typeof amountCents,
      currentAvailable: wallet.availableBalanceCents,
      currentFrozen: wallet.frozenBalanceCents,
    });

    const [updatedWallet] = await database
      .update(wallets)
      .set({
        availableBalanceCents: sql`${wallets.availableBalanceCents} - ${amount}`,
        frozenBalanceCents: sql`${wallets.frozenBalanceCents} + ${amount}`,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(wallets.userId, userId),
          gte(wallets.availableBalanceCents, amount),
        ),
      )
      .returning();

    if (!updatedWallet) {
      throw new BadRequestException('Insufficient funds');
    }

    console.log('Funds held successfully', wallet);

    await this.addWalletTransaction(
      {
        walletId: wallet.userId,
        amountCents: -amountCents,
        type: 'hold',
        bookingId,
        description: 'Funds held for booking',
      },
      database,
    );
    console.log('Transaction added successfully');
  }

  async releaseFunds(
    userId: string,
    amountCents: number,
    bookingId: string | null,
    tx?: any,
  ) {
    const database = tx || this.db;
    const wallet = await this.getWallet(userId);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
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
    const database = tx || this.db;
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
      throw new NotFoundException(
        'One or both wallets not found during transfer',
      );
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
    await this.db.transaction(async (tx) => {
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
    await this.db.transaction(async (tx) => {
      const wallet = await this.getWallet(userId);
      if (wallet.availableBalanceCents < amountCents) {
        throw new BadRequestException('Insufficient funds');
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
  async getTransactions(userId: string) {
    return await this.db
      .select()
      .from(walletTransactions)
      .where(eq(walletTransactions.walletId, userId))
      .orderBy(desc(walletTransactions.createdAt));
  }
}
