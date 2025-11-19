import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../domain/message.repository';

@Injectable()
export class DeleteMessageUseCase {
  constructor(private readonly messageRepo: MessageRepository) {}

  async execute() {}
}
