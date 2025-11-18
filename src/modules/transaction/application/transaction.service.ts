import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../domain/transaction.repository';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepo: TransactionRepository) {}
}
