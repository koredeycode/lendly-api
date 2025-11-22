import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMessageDTO } from 'src/modules/message/application/dto/create-message.dto';
import { CreateReviewDTO } from 'src/modules/review/application/dto/create-review.dto';
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
  async getBooking(@Param('id') id: string) {
    return { message: 'Booking successfuly retrieved' };
  }

  // @ApiResponse({
  //   status: 201,
  //   description: 'The booking has beeen successfully created',
  // })
  // @Post()
  // async createBooking(@Body() body: CreateBookingDTO) {
  //   return { message: 'Booking created successfully' };
  // }

  @ApiResponse({
    status: 200,
    description: 'The item has beeen successfully deleted',
  })
  @Delete(':id')
  async deleteBooking(@Param('id') id: string) {
    return { message: 'Item deleted successfully' };
  }

  @ApiResponse({
    status: 201,
    description: 'The booking has been accepted',
  })
  @Post(':id/accept')
  async acceptBookingRequest(@Param('id') id: string) {
    return { message: 'Booking request submitted successfully' };
  }

  @ApiResponse({
    status: 201,
    description: 'The booking reviews has been retrieved',
  })
  @Get(':id/reviews')
  async getBookingReviews(@Param('id') id: string) {
    return { message: 'Booking reviews retrieved successfully' };
  }

  @ApiResponse({
    status: 201,
    description: 'The booking has been reviewed',
  })
  @Post(':id/reviews')
  async reviewBooking(@Param('id') id: string, @Body() body: CreateReviewDTO) {
    return { message: 'Booking request submitted successfully' };
  }

  @ApiResponse({
    status: 201,
    description: 'Get a booking messages',
  })
  @Get(':id/messages')
  async getBookingMessages(@Param('id') id: string) {
    return { message: 'Booking request submitted successfully' };
  }

  @ApiResponse({
    status: 201,
    description: 'Create a booking messages',
  })
  @Post(':id/messages')
  async createBookingMessage(
    @Param('id') id: string,
    @Body() body: CreateMessageDTO,
  ) {
    return { message: 'Booking request submitted successfully' };
  }
}
