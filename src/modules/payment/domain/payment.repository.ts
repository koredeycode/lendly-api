import { NewPaymentTransaction, PaymentTransaction } from 'src/config/db/schema';

export type UpdatePaymentTransactionDto = Omit<Partial<PaymentTransaction>, 'metadata'> & {
  metadata?: any;
};

export abstract class PaymentRepository {
  abstract createTransaction(data: NewPaymentTransaction): Promise<PaymentTransaction>;
  abstract updateTransaction(
    id: string,
    data: UpdatePaymentTransactionDto,
  ): Promise<PaymentTransaction>;
  abstract getTransactionByReference(reference: string): Promise<PaymentTransaction | null>;
  abstract getTransactionById(id: string): Promise<PaymentTransaction | null>;
}
