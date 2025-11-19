import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../domain/review.repository';

@Injectable()
export class CreateReviewUseCase {
  constructor(private readonly reviewRepo: ReviewRepository) {}

  async execute() {}
}
