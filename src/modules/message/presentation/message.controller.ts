import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Message')
@Controller('messages')
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
    description: 'Create a booking messages',
  })
  @Patch(':id')
  async updateMessage(
    @Param('id') id: string,
    @Body() body: UpdateMessageDTOMessageDTO,
  ) {
    return { message: 'Booking request submitted successfully' };
  }
}
