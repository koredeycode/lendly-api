import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../domain/message.repository';
import { CreateMessageDTO } from './dto/create-message.dto';
import { UpdateMessageDTO } from './dto/update-message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepo: MessageRepository) {}

  async getMessages(id: string) {
    return await this.messageRepo.getChatMessages(id);
  }

  async createMessage(
    bookingId: string,
    senderId: string,
    data: CreateMessageDTO,
  ) {
    return await this.messageRepo.createMessage(bookingId, senderId, data);
  }

  async updateMessage(id: string, data: UpdateMessageDTO) {
    return await this.messageRepo.updateMessage(id, data);
  }

  async deleteMessage(id: string) {
    await this.messageRepo.deleteMessage(id);
  }
}
