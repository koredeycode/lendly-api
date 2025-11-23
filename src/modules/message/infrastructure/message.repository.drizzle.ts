import { Injectable } from '@nestjs/common';
import { and, asc, eq, not } from 'drizzle-orm';
import { db } from 'src/config/db/drizzle/client';
import { chatMessages } from '../../../config/db/schema';
import { CreateMessageDTO } from '../application/dto/create-message.dto';
import { UpdateMessageDTO } from '../application/dto/update-message.dto';
import { MessageRepository } from '../domain/message.repository';

@Injectable()
export class DrizzleMessageRepository implements MessageRepository {
  async getChatMessages(bookingId: string, limit = 50) {
    return await db
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
    const [msg] = await db
      .insert(chatMessages)
      .values({ senderId, bookingId, ...data })
      .returning();
    return msg;
  }

  async updateMessage(id: string, data: UpdateMessageDTO) {
    const [message] = await db
      .update(chatMessages)
      .set(data)
      .where(eq(chatMessages.id, id))
      .returning();
    return message;
  }

  async deleteMessage(id: string) {
    await db.delete(chatMessages).where(eq(chatMessages.id, id));
  }

  async markMessagesAsRead(bookingId: string, userId: string) {
    await db
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
