import { Module, forwardRef } from '@nestjs/common';
import { BookingModule } from 'src/modules/booking/presentation/booking.module';
import { ItemModule } from 'src/modules/item/presentation/item.module';
import { JobsModule } from 'src/modules/jobs/presentation/job.module';
import { WalletService } from 'src/modules/wallet/application/wallet.service';
import { WalletModule } from 'src/modules/wallet/presentation/wallet.module';
import { CreateUserUseCase } from '../application/create-user.usecase';
import { UpdateUserUseCase } from '../application/update-user.usecase';
import { UserService } from '../application/user.service';
import { UserRepository } from '../domain/user.repository';
import { DrizzleUserRepository } from '../infrastructure/user.repository.drizzle';
import { UserController } from './user.controller';

@Module({
  imports: [
    JobsModule,
    WalletModule,
    forwardRef(() => BookingModule),
    ItemModule,
  ],
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
