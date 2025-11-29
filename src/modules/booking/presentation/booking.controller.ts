
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/presentation/jwt-auth.guard';
import { CreateMessageDTO } from 'src/modules/message/application/dto/create-message.dto';
import { MessageResponseDTO, MessagesResponseDTO } from 'src/modules/message/application/dto/message-response.dto';
import { MessageService } from 'src/modules/message/application/message.service';
import { CreateReviewDTO } from 'src/modules/review/application/dto/create-review.dto';
import { ReviewResponseDTO, ReviewsResponseDTO } from 'src/modules/review/application/dto/review-response.dto';
import { ReviewService } from 'src/modules/review/application/review.service';
import { ApproveBookingUseCase } from '../application/approve-booking.usecase';
import { BookingService } from '../application/booking.service';
import { BookingResponseDTO } from '../application/dto/booking-response.dto';
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

  @ApiOperation({ summary: 'Get user bookings' })
  @ApiResponse({
    status: 200,
    description: 'User bookings retrieved successfully',
    type: [BookingResponseDTO],
  })
  @Get('user')
  async getUserBookings(
    @Request() req,
    @Query('type') type: 'borrower' | 'owner',
  ) {
    const data = await this.bookingService.getUserBookings(req.user.id, type);
    return { message: 'User bookings retrieved successfully', data };
  }

  @ApiOperation({ summary: 'Get booking details' })
  @ApiResponse({
    status: 200,
    description: 'The booking has beeen successfully retrieved',
    type: BookingResponseDTO,
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

  @ApiOperation({ summary: 'Delete a booking' })
  @ApiResponse({
    status: 200,
    description: 'The item has beeen successfully deleted',
  })
  @Delete(':id')
  async deleteBooking(@Request() req, @Param('id') id: string) {
    await this.bookingService.deleteBooking(id, req.user.id);
    return { message: 'Booking deleted successfully' };
  }

  @ApiOperation({ summary: 'Approve a booking request' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been accepted',
  })
  @Post(':id/approve')
  async approveBookingRequest(@Request() req, @Param('id') id: string) {
    await this.approveBookingUseCase.execute(id, req.user.id);
    return { message: 'Booking approved successfully' };
  }

  @ApiOperation({ summary: 'Reject or cancel a booking request' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been rejected/cancelled',
  })
  @Post(':id/reject')
  async rejectBookingRequest(@Request() req, @Param('id') id: string) {
    await this.rejectBookingUseCase.execute(id, req.user.id);
    return { message: 'Booking rejected successfully' };
  }

  @ApiOperation({ summary: 'Get reviews for a booking' })
  @ApiResponse({
    status: 201,
    description: 'The booking reviews has been retrieved',
    type: ReviewsResponseDTO,
  })
  @Get(':id/reviews')
  async getBookingReviews(@Param('id') id: string) {
    const data = await this.reviewService.getReviews(id);
    return { message: 'Booking reviews retrieved successfully', data };
  }

  @ApiOperation({ summary: 'Create a review for a booking' })
  @ApiResponse({
    status: 201,
    description: 'The booking has been reviewed',
    type: ReviewResponseDTO,
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

  @ApiOperation({ summary: 'Get messages for a booking' })
  @ApiResponse({
    status: 201,
    description: 'Get a booking messages',
    type: MessagesResponseDTO,
  })
  @Get(':id/messages')
  async getBookingMessages(@Param('id') id: string) {
    const data = await this.messageService.getMessages(id);
    return { message: 'Booking request submitted successfully', data };
  }

  @ApiOperation({ summary: 'Send a message for a booking' })
  @ApiResponse({
    status: 201,
    description: 'Create a booking messages',
    type: MessageResponseDTO,
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
