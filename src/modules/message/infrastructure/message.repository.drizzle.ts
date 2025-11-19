import { MessageCreateDto } from '@koredeycode/lendly-types';
import { Injectable } from '@nestjs/common';
import { and, asc, eq, not } from 'drizzle-orm';
import { db } from 'src/config/db/drizzle/client';
import { chatMessages } from '../../../config/db/schema';
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

  async createMessage(data: MessageCreateDto) {
    const [msg] = await db.insert(chatMessages).values(data).returning();
    return msg;
  }

  async markMessagesAsRead(bookingId: string, userId: string) {
    return await db
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
