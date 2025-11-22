import { ChatMessage } from '@koredeycode/lendly-types';
import { CreateMessageDTO } from '../application/dto/create-message.dto';

export abstract class MessageRepository {
  abstract getChatMessages(bookingId: string, limit: number);
  abstract createMessage(
    bookingId: string,
    senderId: string,
    data: CreateMessageDTO,
  ): Promise<ChatMessage>;
  abstract markMessagesAsRead(bookingId: string, userId: string): Promise<void>;
}
