import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/presentation/jwt-auth.guard';
import { UpdateMessageDTO } from '../application/dto/update-message.dto';

@ApiTags('Message')
@ApiBearerAuth()
@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor() {}

  @ApiResponse({
    status: 200,
    description: 'Message endpoint',
  })
  @Get('/hello')
  hello() {
    return { message: 'Hello from message endpoint' };
  }

  @ApiResponse({
    status: 200,
    description: 'Update a message',
  })
  @Patch(':id')
  async updateMessage(@Param('id') id: string, @Body() body: UpdateMessageDTO) {
    return { message: 'Message updated successfully' };
  }

  @ApiResponse({
    status: 200,
    description: 'Delete a message',
  })
  @Delete(':id')
  async deleteMessage(@Param('id') id: string) {
    return { message: 'Message deleted successfully' };
  }
}
