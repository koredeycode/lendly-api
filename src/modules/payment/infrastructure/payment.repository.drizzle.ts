import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/config/db/schema';
import {
    NewPaymentTransaction,
    PaymentTransaction,
    paymentTransactions,
} from 'src/config/db/schema';
import { DRIZZLE } from 'src/modules/database/database.constants';
import {
    PaymentRepository,
    UpdatePaymentTransactionDto,
} from '../domain/payment.repository';

@Injectable()
export class DrizzlePaymentRepository implements PaymentRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>) {}

  async createTransaction(
    data: NewPaymentTransaction,
  ): Promise<PaymentTransaction> {
    const [tx] = await this.db.insert(paymentTransactions).values(data).returning();
    return tx;
  }

  async updateTransaction(
    id: string,
    data: UpdatePaymentTransactionDto,
  ): Promise<PaymentTransaction> {
    const { metadata, ...rest } = data;
    const [tx] = await this.db
      .update(paymentTransactions)
      .set({
        ...rest,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(paymentTransactions.id, id))
      .returning();
    return tx;
  }

  async getTransactionByReference(
    reference: string,
  ): Promise<PaymentTransaction | null> {
    const [tx] = await this.db
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.reference, reference))
      .limit(1);
    return tx ?? null;
  }

  async getTransactionById(id: string): Promise<PaymentTransaction | null> {
    const [tx] = await this.db
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.id, id))
      .limit(1);
    return tx ?? null;
  }
}
