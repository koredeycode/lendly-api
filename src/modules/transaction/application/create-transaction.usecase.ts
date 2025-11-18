import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../domain/transaction.repository';

@Injectable()
export class CreateTransactionUseCase {
  constructor(private readonly transactionRepo: TransactionRepository) {}

  async execute() {}
}
