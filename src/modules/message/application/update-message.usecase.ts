import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../domain/message.repository';

@Injectable()
export class UpdateMessageUseCase {
  constructor(private readonly messageRepo: MessageRepository) {}

  async execute() {}
}
