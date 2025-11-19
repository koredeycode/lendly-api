import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../domain/message.repository';

@Injectable()
export class DrizzleMessageRepository implements MessageRepository {}
