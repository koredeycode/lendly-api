import { Module } from '@nestjs/common';
import { JobsModule } from 'src/modules/jobs/presentation/job.module';
import { CreateWalletUseCase } from '../application/create-wallet.usecase';
import { DeleteWalletUseCase } from '../application/delete-wallet.usecase';
import { EditWalletUseCase } from '../application/edit-wallet.usecase';
import { WalletService } from '../application/wallet.service';
import { WalletRepository } from '../domain/wallet.repository';
import { DrizzleWalletRepository } from '../infrastructure/wallet.repository.drizzle';
import { WalletController } from './item.controller';

@Module({
  imports: [JobsModule],
  controllers: [WalletController],
  providers: [
    WalletService,
    CreateWalletUseCase,
    EditWalletUseCase,
    DeleteWalletUseCase,
    {
      provide: WalletRepository,
      useClass: DrizzleWalletRepository,
    },
  ],
  exports: [WalletRepository],
})
export class WalletModule {}
