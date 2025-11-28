import { Review } from 'src/config/db/schema';
import { CreateReviewDTO } from '../application/dto/create-review.dto';
import { UpdateReviewDTO } from '../application/dto/update-review.dto';

export abstract class ReviewRepository {
  abstract createReview(
    bookingId: string,
    reviewerId: string,
    revieweeId: string,
    data: CreateReviewDTO,
  ): Promise<Review>;
  abstract getReviews(bookingId: string): Promise<Review[]>;
  abstract updateReview(id: string, data: UpdateReviewDTO): Promise<Review>;
  abstract deleteReview(id: string): Promise<void>;
  abstract hasUserReviewedBooking(
    bookingId: string,
    reviewerId: string,
  ): Promise<boolean>;
}
