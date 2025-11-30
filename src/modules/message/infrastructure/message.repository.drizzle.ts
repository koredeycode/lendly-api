import { Inject, Injectable } from '@nestjs/common';
import { and, asc, eq, not } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/config/db/schema';
import { DRIZZLE } from 'src/modules/database/database.constants';
import { chatMessages } from '../../../config/db/schema';
import { CreateMessageDTO } from '../application/dto/create-message.dto';
import { UpdateMessageDTO } from '../application/dto/update-message.dto';
import { MessageRepository } from '../domain/message.repository';

@Injectable()
export class DrizzleMessageRepository implements MessageRepository {
  constructor(@Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>) {}

  async getChatMessages(bookingId: string, limit = 50) {
    return await this.db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.bookingId, bookingId))
      .orderBy(asc(chatMessages.createdAt))
      .limit(limit);
  }

  async createMessage(
    bookingId: string,
    senderId: string,
    data: CreateMessageDTO,
  ) {
    const [msg] = await this.db
      .insert(chatMessages)
      .values({ senderId, bookingId, ...data })
      .returning();
    return msg;
  }

  async updateMessage(id: string, data: UpdateMessageDTO) {
    const [message] = await this.db
      .update(chatMessages)
      .set(data)
      .where(eq(chatMessages.id, id))
      .returning();
    return message;
  }

  async deleteMessage(id: string) {
    await this.db.delete(chatMessages).where(eq(chatMessages.id, id));
  }

  async markMessagesAsRead(bookingId: string, userId: string) {
    await this.db
      .update(chatMessages)
      .set({ isRead: true })
      .where(
        and(
          eq(chatMessages.bookingId, bookingId),
          not(eq(chatMessages.senderId, userId)),
          eq(chatMessages.isRead, false),
        ),
      );
  }
}
