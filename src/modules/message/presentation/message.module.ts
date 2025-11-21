import { Module } from '@nestjs/common';
import { JobsModule } from 'src/modules/jobs/presentation/job.module';
import { CreateMessageUseCase } from '../application/create-message.usecase';
import { DeleteMessageUseCase } from '../application/delete-message.usecase';
import { MessageService } from '../application/message.service';
import { EditMessageUseCase } from '../application/edit-message.usecase';
import { MessageRepository } from '../domain/message.repository';
import { DrizzleMessageRepository } from '../infrastructure/message.repository.drizzle';
import { MessageController } from './message.controller';

@Module({
  imports: [JobsModule],
  controllers: [MessageController],
  providers: [
    MessageService,
    CreateMessageUseCase,
    EditMessageUseCase,
    DeleteMessageUseCase,
    {
      provide: MessageRepository,
      useClass: DrizzleMessageRepository,
    },
  ],
  exports: [MessageRepository],
})
export class MessageModule {}
