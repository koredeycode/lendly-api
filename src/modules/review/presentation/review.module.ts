import { Module } from '@nestjs/common';
import { JobsModule } from 'src/modules/jobs/presentation/job.module';
import { CreateReviewUseCase } from '../application/create-review.usecase';
import { DeleteReviewUseCase } from '../application/delete-review.usecase';
import { ReviewService } from '../application/review.service';
import { UpdateReviewUseCase } from '../application/update-review.usecase';
import { ReviewRepository } from '../domain/review.repository';
import { DrizzleReviewRepository } from '../infrastructure/review.repository.drizzle';
import { ReviewController } from './review.controller';

@Module({
  imports: [JobsModule],
  controllers: [ReviewController],
  providers: [
    ReviewService,
    CreateReviewUseCase,
    UpdateReviewUseCase,
    DeleteReviewUseCase,
    {
      provide: ReviewRepository,
      useClass: DrizzleReviewRepository,
    },
  ],
  exports: [ReviewRepository],
})
export class ReviewModule {}
