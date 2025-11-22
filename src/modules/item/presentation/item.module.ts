import { Module } from '@nestjs/common';
import { JobsModule } from 'src/modules/jobs/presentation/job.module';
import { CreateItemUseCase } from '../application/create-item.usecase';
import { DeleteItemUseCase } from '../application/delete-item.usecase';
import { ItemService } from '../application/item.service';
import { UpdateItemUseCase } from '../application/update-item.usecase';
import { ItemRepository } from '../domain/item.repository';
import { DrizzleItemRepository } from '../infrastructure/item.repository.drizzle';
import { ItemController } from './item.controller';
import { BookingModule } from 'src/modules/booking/presentation/booking.module';
import { CreateBookingUseCase } from 'src/modules/booking/application/create-booking.usecase';

@Module({
  imports: [JobsModule, BookingModule],
  controllers: [ItemController],
  providers: [
    ItemService,
    CreateItemUseCase,
    UpdateItemUseCase,
    DeleteItemUseCase,
    {
      provide: ItemRepository,
      useClass: DrizzleItemRepository,
    },
    CreateBookingUseCase,
  ],
  exports: [ItemRepository],
})
export class ItemModule {}
