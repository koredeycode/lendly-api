import { Injectable } from '@nestjs/common';
import { and, count, eq } from 'drizzle-orm';
import { db } from 'src/config/db/drizzle/client';
import { reviews } from 'src/config/db/schema';
import { CreateReviewDTO } from '../application/dto/create-review.dto';
import { UpdateReviewDTO } from '../application/dto/update-review.dto';
import { ReviewRepository } from '../domain/review.repository';

@Injectable()
export class DrizzleReviewRepository implements ReviewRepository {
  async createReview(
    bookingId: string,
    reviewerId: string,
    revieweeId: string,
    data: CreateReviewDTO,
  ) {
    const [review] = await db
      .insert(reviews)
      .values({ bookingId, revieweeId, reviewerId, ...data })
      .returning();
    return review;
  }

  async updateReview(id: string, data: UpdateReviewDTO) {
    const [review] = await db
      .update(reviews)
      .set({ ...data })
      .where(eq(reviews.id, id))
      .returning();

    return review;
  }

  async deleteReview(id: string) {
    await db.delete(reviews).where(eq(reviews.id, id));
  }

  async hasUserReviewedBooking(bookingId: string, reviewerId: string) {
    const result = await db
      .select({ count: count() })
      .from(reviews)
      .where(
        and(
          eq(reviews.bookingId, bookingId),
          eq(reviews.reviewerId, reviewerId),
        ),
      );
    return result[0].count > 0;
  }
}
