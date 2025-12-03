import { Inject, Injectable } from '@nestjs/common';
import { and, asc, count, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/config/db/schema';
import { Review, reviews } from 'src/config/db/schema';
import { DRIZZLE } from 'src/modules/database/database.constants';
import { CreateReviewDTO } from '../application/dto/create-review.dto';
import { UpdateReviewDTO } from '../application/dto/update-review.dto';
import { ReviewRepository } from '../domain/review.repository';

@Injectable()
export class DrizzleReviewRepository implements ReviewRepository {
  constructor(
    @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async createReview(
    bookingId: string,
    reviewerId: string,
    data: CreateReviewDTO,
  ) {
    const [review] = await this.db
      .insert(reviews)
      .values({ bookingId, reviewerId, ...data })
      .returning();
    return review;
  }

  async getReviews(bookingId: string): Promise<Review[]> {
    return await this.db
      .select()
      .from(reviews)
      .where(eq(reviews.bookingId, bookingId))
      .orderBy(asc(reviews.createdAt));
  }

  async updateReview(id: string, data: UpdateReviewDTO) {
    const [review] = await this.db
      .update(reviews)
      .set({ ...data })
      .where(eq(reviews.id, id))
      .returning();

    return review;
  }

  async deleteReview(id: string) {
    await this.db.delete(reviews).where(eq(reviews.id, id));
  }

  async hasUserReviewedBooking(bookingId: string, reviewerId: string) {
    const result = await this.db
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
