import { Module, forwardRef } from '@nestjs/common';
import { CreateBookingUseCase } from 'src/modules/booking/application/create-booking.usecase';
import { BookingModule } from 'src/modules/booking/presentation/booking.module';
import { JobsModule } from 'src/modules/jobs/presentation/job.module';
import { WalletModule } from 'src/modules/wallet/presentation/wallet.module';
import { CreateItemUseCase } from '../application/create-item.usecase';
import { DeleteItemUseCase } from '../application/delete-item.usecase';
import { ItemService } from '../application/item.service';
import { UpdateItemUseCase } from '../application/update-item.usecase';
import { ItemRepository } from '../domain/item.repository';
import { DrizzleItemRepository } from '../infrastructure/item.repository.drizzle';
import { ItemController } from './item.controller';

@Module({
  imports: [JobsModule, forwardRef(() => BookingModule), WalletModule],
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
