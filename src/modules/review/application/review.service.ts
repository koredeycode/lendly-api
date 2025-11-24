import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../domain/review.repository';
import { CreateReviewDTO } from './dto/create-review.dto';
import { UpdateReviewDTO } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepo: ReviewRepository,
    // private readonly bookingRepo: BookingRepository,
    // private readonly itemRepo: ItemRepository,
  ) {}

  async createReview(
    bookingId: string,
    reviewerId: string,
    data: CreateReviewDTO,
  ) {
    //Todo: might just remove revieweeId from the table, the other party can be gotten
    //TODO: notify the other party of the review via email
    let revieweeId: string = '';
    // const booking = await this.bookingRepo.findBookingById(bookingId);
    // const item = await this.itemRepo.findItemById(booking?.itemId || '');

    // if (booking === null || item === null) {
    //   return;
    // }
    // if (item.ownerId === reviewerId) {
    //   revieweeId = booking.borrowerId;
    // } else {
    //   revieweeId = item.ownerId;
    // }
    return await this.reviewRepo.createReview(
      bookingId,
      reviewerId,
      revieweeId,
      data,
    );
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
