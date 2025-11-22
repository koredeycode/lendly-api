import { Module } from '@nestjs/common';
import { JobsModule } from 'src/modules/jobs/presentation/job.module';
import { CreateUserUseCase } from '../application/create-user.usecase';
import { UpdateUserUseCase } from '../application/update-user.usecase';
import { UserService } from '../application/user.service';
import { UserRepository } from '../domain/user.repository';
import { DrizzleUserRepository } from '../infrastructure/user.repository.drizzle';
import { UserController } from './user.controller';
import { WalletModule } from 'src/modules/wallet/presentation/wallet.module';
import { WalletService } from 'src/modules/wallet/application/wallet.service';

@Module({
  imports: [JobsModule, WalletModule],
  controllers: [UserController],
  providers: [
    UserService,
    CreateUserUseCase,
    UpdateUserUseCase,
    {
      provide: UserRepository,
      useClass: DrizzleUserRepository,
    },
    WalletService,
  ],
  exports: [UserRepository],
})
export class UserModule {}
