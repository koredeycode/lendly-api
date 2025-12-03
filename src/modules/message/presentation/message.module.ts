import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/presentation/auth.module';
import { JobsModule } from 'src/modules/jobs/presentation/job.module';
import { CreateMessageUseCase } from '../application/create-message.usecase';
import { DeleteMessageUseCase } from '../application/delete-message.usecase';
import { MessageService } from '../application/message.service';
import { UpdateMessageUseCase } from '../application/update-message.usecase';
import { MessageRepository } from '../domain/message.repository';
import { DrizzleMessageRepository } from '../infrastructure/message.repository.drizzle';
import { MessageController } from './message.controller';
import { MessageGateway } from './message.gateway';

@Module({
  imports: [JobsModule, forwardRef(() => AuthModule)],
  controllers: [MessageController],
  providers: [
    MessageService,
    CreateMessageUseCase,
    UpdateMessageUseCase,
    DeleteMessageUseCase,
    MessageGateway,
    {
      provide: MessageRepository,
      useClass: DrizzleMessageRepository,
    },
  ],
  exports: [MessageRepository, MessageService],
})
export class MessageModule {}
