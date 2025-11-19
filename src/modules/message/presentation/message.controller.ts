import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Message')
@Controller('messages')
export class MessageController {
  constructor() {}
}
