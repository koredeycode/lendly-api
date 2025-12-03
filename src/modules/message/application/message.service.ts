import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../domain/message.repository';
import { MessageGateway } from '../presentation/message.gateway';
import { CreateMessageDTO } from './dto/create-message.dto';
import { UpdateMessageDTO } from './dto/update-message.dto';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepo: MessageRepository,
    private readonly gateway: MessageGateway,
  ) {}

  async getMessages(id: string) {
    return await this.messageRepo.getChatMessages(id);
  }

  async createMessage(
    bookingId: string,
    senderId: string,
    data: CreateMessageDTO,
  ) {
    const message = await this.messageRepo.createMessage(
      bookingId,
      senderId,
      data,
    );
    this.gateway.sendMessage(bookingId, message);
    return message;
  }

  async updateMessage(id: string, data: UpdateMessageDTO) {
    return await this.messageRepo.updateMessage(id, data);
  }

  async deleteMessage(id: string) {
    await this.messageRepo.deleteMessage(id);
  }
}
