import { Module } from '@nestjs/common';
import { JobsModule } from 'src/modules/jobs/presentation/job.module';
import { CreateItemUseCase } from '../application/create-item.usecase';
import { DeleteItemUseCase } from '../application/delete-item.usecase';
import { EditItemUseCase } from '../application/edit-item.usecase';
import { ItemService } from '../application/item.service';
import { ItemRepository } from '../domain/item.repository';
import { DrizzleItemRepository } from '../infrastructure/item.repository.drizzle';
import { ItemController } from './item.controller';

@Module({
  imports: [JobsModule],
  controllers: [ItemController],
  providers: [
    ItemService,
    CreateItemUseCase,
    EditItemUseCase,
    DeleteItemUseCase,
    {
      provide: ItemRepository,
      useClass: DrizzleItemRepository,
    },
  ],
  exports: [ItemRepository],
})
export class ItemModule {}
