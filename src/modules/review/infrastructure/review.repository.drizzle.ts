import { Injectable } from '@nestjs/common';
import { and, count, eq } from 'drizzle-orm';
import { db } from 'src/config/db/drizzle/client';
import { reviews } from 'src/config/db/schema';
import { ReviewRepository } from '../domain/review.repository';
import { Review } from './review.entity';

@Injectable()
export class DrizzleReviewRepository implements ReviewRepository {
  async createReview(data: Review) {
    const [review] = await db.insert(reviews).values(data).returning();
    return review;
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
