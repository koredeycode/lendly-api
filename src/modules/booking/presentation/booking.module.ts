import { Module } from '@nestjs/common';
import { JobsModule } from 'src/modules/jobs/presentation/job.module';
import { CreateBookingUseCase } from '../application/create-booking.usecase';
import { BookingService } from '../application/booking.service';
import { BookingRepository } from '../domain/booking.repository';
import { DrizzleBookingRepository } from '../infrastructure/booking.repository.drizzle';
import { BookingController } from './booking.controller';

@Module({
  imports: [JobsModule],
  controllers: [BookingController],
  providers: [
    BookingService,
    CreateBookingUseCase,
    {
      provide: BookingRepository,
      useClass: DrizzleBookingRepository,
    },
  ],
  exports: [BookingRepository],
})
export class BookingModule {}
