import { Module, forwardRef } from '@nestjs/common';
import { JobsModule } from 'src/modules/jobs/presentation/job.module';
import { MessageModule } from 'src/modules/message/presentation/message.module';
import { ReviewModule } from 'src/modules/review/presentation/review.module';
import { BookingService } from '../application/booking.service';
import { CreateBookingUseCase } from '../application/create-booking.usecase';
import { BookingRepository } from '../domain/booking.repository';
import { DrizzleBookingRepository } from '../infrastructure/booking.repository.drizzle';
import { BookingController } from './booking.controller';

import { ItemModule } from 'src/modules/item/presentation/item.module';
import { WalletModule } from 'src/modules/wallet/presentation/wallet.module';
import { AcceptBookingUseCase } from '../application/accept-booking.usecase';
import { RejectBookingUseCase } from '../application/reject-booking.usecase';

import { UserModule } from 'src/modules/user/presentation/user.module';

import { CancelBookingUseCase } from '../application/cancel-booking.usecase';
import { CompleteBookingUseCase } from '../application/complete-booking.usecase';
import { MarkBookingOverdueUseCase } from '../application/mark-booking-overdue.usecase';
import { PickupBookingUseCase } from '../application/pickup-booking.usecase';
import { ReturnBookingUseCase } from '../application/return-booking.usecase';

@Module({
  imports: [
    JobsModule,
    MessageModule,
    forwardRef(() => ReviewModule),
    WalletModule,
    forwardRef(() => ItemModule),
    forwardRef(() => UserModule),
  ],
  controllers: [BookingController],
  providers: [
    BookingService,
    CreateBookingUseCase,
    AcceptBookingUseCase,
    RejectBookingUseCase,
    CancelBookingUseCase,
    ReturnBookingUseCase,
    PickupBookingUseCase,
    CompleteBookingUseCase,
    MarkBookingOverdueUseCase,
    {
      provide: BookingRepository,
      useClass: DrizzleBookingRepository,
    },
  ],
  exports: [BookingRepository, BookingService, CreateBookingUseCase],
})
export class BookingModule {}
