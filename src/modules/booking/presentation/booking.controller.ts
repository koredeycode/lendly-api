import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Booking')
@Controller('bookings')
export class BookingController {
  constructor() {}

  @ApiResponse({
    status: 200,
    description: 'Booking endpoint',
  })
  @Get('/hello')
  hello() {
    return { message: 'Hello from booking endpoint' };
  }
}
