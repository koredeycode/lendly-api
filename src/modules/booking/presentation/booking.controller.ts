import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { JwtAuthGuard } from 'src/modules/auth/presentation/jwt-auth.guard';
import { CreateMessageDTO } from 'src/modules/message/application/dto/create-message.dto';
import {
  MessageResponseDTO,
  MessagesResponseDTO,
} from 'src/modules/message/application/dto/message-response.dto';
import { MessageService } from 'src/modules/message/application/message.service';
import { CreateReviewDTO } from 'src/modules/review/application/dto/create-review.dto';
import {
  ReviewResponseDTO,
  ReviewsResponseDTO,
} from 'src/modules/review/application/dto/review-response.dto';
import { ReviewService } from 'src/modules/review/application/review.service';
import { ApproveBookingUseCase } from '../application/approve-booking.usecase';
import { BookingService } from '../application/booking.service';
import { BookingResponseDTO } from '../application/dto/booking-response.dto';
import { RejectBookingUseCase } from '../application/reject-booking.usecase';

import { CancelBookingUseCase } from '../application/cancel-booking.usecase';
import { PickupBookingUseCase } from '../application/pickup-booking.usecase';
import { ReturnBookingUseCase } from '../application/return-booking.usecase';
import { CompleteBookingUseCase } from '../application/complete-booking.usecase';

@ApiTags('Booking')
@Controller('bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly messageService: MessageService,
    private readonly reviewService: ReviewService,
    private readonly approveBookingUseCase: ApproveBookingUseCase,
    private readonly rejectBookingUseCase: RejectBookingUseCase,
    private readonly cancelBookingUseCase: CancelBookingUseCase,
    private readonly returnBookingUseCase: ReturnBookingUseCase,
    private readonly pickupBookingUseCase: PickupBookingUseCase,
    private readonly completeBookingUseCase: CompleteBookingUseCase,
  ) {}

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
  async deleteBooking(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    await this.bookingService.deleteBooking(id, req.user.id);
    return { message: 'Booking deleted successfully' };
  }

  @ApiOperation({ summary: 'Approve a booking request' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been accepted',
  })
  @Post(':id/approve')
  async approveBookingRequest(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    await this.approveBookingUseCase.execute(id, req.user.id);
    return { message: 'Booking approved successfully' };
  }

  @ApiOperation({ summary: 'Reject a booking request' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been rejected',
  })
  @Post(':id/reject')
  async rejectBookingRequest(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    await this.rejectBookingUseCase.execute(id, req.user.id);
    return { message: 'Booking rejected successfully' };
  }

  @ApiOperation({ summary: 'Cancel a booking request' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been cancelled',
  })
  @Post(':id/cancel')
  async cancelBookingRequest(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    await this.cancelBookingUseCase.execute(id, req.user.id);
    return { message: 'Booking cancelled successfully' };
  }

  @ApiOperation({ summary: 'Confirm item return' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been marked as returned',
  })
  @Post(':id/return')
  async returnBooking(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    await this.returnBookingUseCase.execute(id, req.user.id);
    return { message: 'Item return confirmed successfully' };
  }

  @ApiOperation({ summary: 'Mark booking as picked up' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been marked as picked up',
  })
  @Post(':id/pickup')
  async pickupBooking(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    await this.pickupBookingUseCase.execute(id, req.user.id);
    return { message: 'Booking picked up successfully' };
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
    @Request() req: AuthenticatedRequest,
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
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: CreateMessageDTO,
  ) {
    const data = await this.messageService.createMessage(id, req.user.id, body);
    return { message: 'Message sent successfully', data };
  }

  @ApiOperation({ summary: 'Mark booking as completed' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been marked as completed',
  })
  @Post(':id/complete')
  async completeBooking(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    await this.completeBookingUseCase.execute(id, req.user.id);
    return { message: 'Booking completed successfully' };
  }
}
