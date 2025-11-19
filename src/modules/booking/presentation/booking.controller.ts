import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookingService } from '../application/booking.service';

@ApiTags('Booking')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiResponse({
    status: 200,
    description: 'Booking endpoint',
  })
  @Get('/hello')
  hello() {
    return { message: 'Hello from booking endpoint' };
  }

  @ApiResponse({
    status: 200,
    description: 'The booking has beeen successfully retrieved',
  })
  @Get(':id')
  async getBooking(@Param('id') id: string, @Body() body: any) {
    return { message: 'Booking successfuly retrieved' };
  }

  @ApiResponse({
    status: 201,
    description: 'The booking has beeen successfully created',
  })
  @Post()
  async createBooking(@Body() body: any) {
    return { message: 'Booking created successfully' };
  }

  @ApiResponse({
    status: 200,
    description: 'The item has beeen successfully deleted',
  })
  @Delete(':id')
  async deleteBooking(@Param('id') id: string, @Body() body: any) {
    return { message: 'Item deleted successfully' };
  }

  @ApiResponse({
    status: 201,
    description: 'The booking has been accepted',
  })
  @Patch(':id/accept')
  async acceptBookingRequest(@Param('id') id: string, @Body() body: any) {
    return { message: 'Booking request submitted successfully' };
  }

  @ApiResponse({
    status: 201,
    description: 'The booking has been reviewed',
  })
  @Patch(':id/review')
  async reviewBooking(@Param('id') id: string, @Body() body: any) {
    return { message: 'Booking request submitted successfully' };
  }
}
