import { Module, forwardRef } from '@nestjs/common';
import { JobsModule } from 'src/modules/jobs/presentation/job.module';
import { MessageService } from 'src/modules/message/application/message.service';
import { MessageModule } from 'src/modules/message/presentation/message.module';
import { ReviewService } from 'src/modules/review/application/review.service';
import { ReviewModule } from 'src/modules/review/presentation/review.module';
import { BookingService } from '../application/booking.service';
import { CreateBookingUseCase } from '../application/create-booking.usecase';
import { BookingRepository } from '../domain/booking.repository';
import { DrizzleBookingRepository } from '../infrastructure/booking.repository.drizzle';
import { BookingController } from './booking.controller';

import { ItemModule } from 'src/modules/item/presentation/item.module';
import { WalletModule } from 'src/modules/wallet/presentation/wallet.module';
import { ApproveBookingUseCase } from '../application/approve-booking.usecase';
import { RejectBookingUseCase } from '../application/reject-booking.usecase';

import { UserModule } from 'src/modules/user/presentation/user.module';


import { CancelBookingUseCase } from '../application/cancel-booking.usecase';
import { CompleteBookingUseCase } from '../application/complete-booking.usecase';
import { PickupBookingUseCase } from '../application/pickup-booking.usecase';
import { ReturnBookingUseCase } from '../application/return-booking.usecase';

@Module({
  imports: [
    JobsModule,
    MessageModule,
    ReviewModule,
    WalletModule,
    forwardRef(() => ItemModule),
    forwardRef(() => UserModule),

  ],
  controllers: [BookingController],
  providers: [
    BookingService,
    CreateBookingUseCase,
    ApproveBookingUseCase,
    RejectBookingUseCase,
    CancelBookingUseCase,
    ReturnBookingUseCase,
    PickupBookingUseCase,
    CompleteBookingUseCase,
    {
      provide: BookingRepository,
      useClass: DrizzleBookingRepository,
    },
    MessageService,
    ReviewService,

  ],
  exports: [BookingRepository, BookingService, CreateBookingUseCase],
})
export class BookingModule {}
