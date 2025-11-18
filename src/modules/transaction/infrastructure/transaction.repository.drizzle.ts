import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../domain/transaction.repository';

@Injectable()
export class DrizzleTransactionRepository implements TransactionRepository {}
