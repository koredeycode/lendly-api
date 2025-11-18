import { Module } from '@nestjs/common';
import { JobsModule } from 'src/modules/jobs/presentation/job.module';
import { CreateTransactionUseCase } from '../application/create-transaction.usecase';
import { TransactionService } from '../application/transaction.service';
import { TransactionRepository } from '../domain/transaction.repository';
import { DrizzleTransactionRepository } from '../infrastructure/transaction.repository.drizzle';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [JobsModule],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    CreateTransactionUseCase,
    {
      provide: TransactionRepository,
      useClass: DrizzleTransactionRepository,
    },
  ],
  exports: [TransactionRepository],
})
export class TransactionModule {}
