import { MessageCreateDto } from '@koredeycode/lendly-types';

export abstract class MessageRepository {
  abstract getChatMessages(bookingId: string, limit: number);
  abstract createMessage(data: MessageCreateDto);
  abstract markMessagesAsRead(bookingId: string, userId: string);
}
