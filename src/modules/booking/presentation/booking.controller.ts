import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/presentation/jwt-auth.guard';
import { CreateMessageDTO } from 'src/modules/message/application/dto/create-message.dto';
import { MessageService } from 'src/modules/message/application/message.service';
import { CreateReviewDTO } from 'src/modules/review/application/dto/create-review.dto';
import { ReviewService } from 'src/modules/review/application/review.service';
import { BookingService } from '../application/booking.service';

import { ApproveBookingUseCase } from '../application/approve-booking.usecase';
import { RejectBookingUseCase } from '../application/reject-booking.usecase';

@ApiTags('Booking')
@Controller('bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly messageService: MessageService,
    private readonly reviewService: ReviewService,
    private readonly approveBookingUseCase: ApproveBookingUseCase,
    private readonly rejectBookingUseCase: RejectBookingUseCase,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'The booking has beeen successfully retrieved',
  })
  @Get(':id')
  async getBooking(@Param('id') id: string) {
    const data = await this.bookingService.findBooking(id);
    return { message: 'Booking successfuly retrieved', data };
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
    await this.bookingService.deleteBooking(id);
    return { message: 'Item deleted successfully' };
  }

  @ApiResponse({
    status: 200,
    description: 'The booking has been accepted',
  })
  @Post(':id/approve')
  async approveBookingRequest(@Request() req, @Param('id') id: string) {
    await this.approveBookingUseCase.execute(id, req.user.id);
    return { message: 'Booking approved successfully' };
  }

  @ApiResponse({
    status: 200,
    description: 'The booking has been rejected/cancelled',
  })
  @Post(':id/reject')
  async rejectBookingRequest(@Request() req, @Param('id') id: string) {
    await this.rejectBookingUseCase.execute(id, req.user.id);
    return { message: 'Booking rejected successfully' };
  }

  @ApiResponse({
    status: 201,
    description: 'The booking reviews has been retrieved',
  })
  @Get(':id/reviews')
  async getBookingReviews(@Param('id') id: string) {
    const data = await this.reviewService.getReviews(id);
    return { message: 'Booking reviews retrieved successfully', data };
  }

  @ApiResponse({
    status: 201,
    description: 'The booking has been reviewed',
  })
  @Post(':id/reviews')
  async reviewBooking(
    @Request() req,
    @Param('id') id: string,
    @Body() body: CreateReviewDTO,
  ) {
    const data = await this.reviewService.createReview(id, req.user.id, body);
    return { message: 'Booking revivew created successfully', data };
  }

  @ApiResponse({
    status: 201,
    description: 'Get a booking messages',
  })
  @Get(':id/messages')
  async getBookingMessages(@Param('id') id: string) {
    const data = await this.messageService.getMessages(id);
    return { message: 'Booking request submitted successfully', data };
  }

  @ApiResponse({
    status: 201,
    description: 'Create a booking messages',
  })
  @Post(':id/messages')
  async createBookingMessage(
    @Request() req,
    @Param('id') id: string,
    @Body() body: CreateMessageDTO,
  ) {
    const data = await this.messageService.createMessage(id, req.user.id, body);
    return { message: 'Booking request submitted successfully', data };
  }
}
