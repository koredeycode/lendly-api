import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from 'src/config/db/drizzle/client';
import {
  NewPaymentTransaction,
  PaymentTransaction,
  paymentTransactions,
} from 'src/config/db/schema';
import {
  PaymentRepository,
  UpdatePaymentTransactionDto,
} from '../domain/payment.repository';

@Injectable()
export class DrizzlePaymentRepository implements PaymentRepository {
  async createTransaction(
    data: NewPaymentTransaction,
  ): Promise<PaymentTransaction> {
    const [tx] = await db.insert(paymentTransactions).values(data).returning();
    return tx;
  }

  async updateTransaction(
    id: string,
    data: UpdatePaymentTransactionDto,
  ): Promise<PaymentTransaction> {
    const { metadata, ...rest } = data;
    const [tx] = await db
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
    const [tx] = await db
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.reference, reference))
      .limit(1);
    return tx ?? null;
  }

  async getTransactionById(id: string): Promise<PaymentTransaction | null> {
    const [tx] = await db
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.id, id))
      .limit(1);
    return tx ?? null;
  }
}
