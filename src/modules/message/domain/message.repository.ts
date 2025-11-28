import { ChatMessage } from 'src/config/db/schema';
import { CreateMessageDTO } from '../application/dto/create-message.dto';
import { UpdateMessageDTO } from '../application/dto/update-message.dto';

export abstract class MessageRepository {
  abstract getChatMessages(
    bookingId: string,
    limit?: number,
  ): Promise<ChatMessage[]>;
  abstract createMessage(
    bookingId: string,
    senderId: string,
    data: CreateMessageDTO,
  ): Promise<ChatMessage>;
  abstract markMessagesAsRead(bookingId: string, userId: string): Promise<void>;
  abstract updateMessage(
    id: string,
    data: UpdateMessageDTO,
  ): Promise<ChatMessage>;
  abstract deleteMessage(id: string): Promise<void>;
}
