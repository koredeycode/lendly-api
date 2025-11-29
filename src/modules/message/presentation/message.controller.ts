import {
    Body,
    Controller,
    Delete,
    Param,
    Patch,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/presentation/jwt-auth.guard';
import { UpdateMessageDTO } from '../application/dto/update-message.dto';
import { MessageService } from '../application/message.service';

@ApiTags('Message')
@ApiBearerAuth()
@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOperation({ summary: 'Update a message' })
  @ApiResponse({
    status: 200,
    description: 'Update a message',
  })
  @Patch(':id')
  async updateMessage(@Param('id') id: string, @Body() body: UpdateMessageDTO) {
    const data = await this.messageService.updateMessage(id, body);
    return { message: 'Message updated successfully', data };
  }

  @ApiOperation({ summary: 'Delete a message' })
  @ApiResponse({
    status: 200,
    description: 'Delete a message',
  })
  @Delete(':id')
  async deleteMessage(@Param('id') id: string) {
    await this.messageService.deleteMessage(id);
    return { message: 'Message deleted successfully' };
  }
}
