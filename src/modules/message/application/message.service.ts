import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../domain/message.repository';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepo: MessageRepository) {}
}
