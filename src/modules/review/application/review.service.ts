import {
    BadRequestException, Injectable, NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { BookingRepository } from '../../booking/domain/booking.repository';
import { ReviewRepository } from '../domain/review.repository';
import { CreateReviewDTO } from './dto/create-review.dto';
import { UpdateReviewDTO } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepo: ReviewRepository,
    private readonly bookingRepo: BookingRepository,
  ) {}

  async createReview(
    bookingId: string,
    reviewerId: string,
    data: CreateReviewDTO,
  ) {
    const booking = await this.bookingRepo.findBookingById(bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.borrowerId !== reviewerId && booking.item.ownerId !== reviewerId) {
      throw new UnauthorizedException(
        'You are not authorized to review this booking',
      );
    }

    const hasReviewed = await this.reviewRepo.hasUserReviewedBooking(
      bookingId,
      reviewerId,
    );
    if (hasReviewed) {
      throw new BadRequestException('You have already reviewed this booking');
    }

    return await this.reviewRepo.createReview(bookingId, reviewerId, data);
  }

  async getReviews(bookingId: string) {
    return await this.reviewRepo.getReviews(bookingId);
  }

  async updateReview(id: string, data: UpdateReviewDTO) {
    return await this.reviewRepo.updateReview(id, data);
  }

  async deleteReview(id: string) {
    await this.reviewRepo.deleteReview(id);
  }
}
