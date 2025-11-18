import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Booking')
@Controller('bookings')
export class BookingController {
  constructor() {}
}
