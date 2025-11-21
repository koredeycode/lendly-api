import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../domain/review.repository';

@Injectable()
export class EditReviewUseCase {
  constructor(private readonly reviewRepo: ReviewRepository) {}

  async execute() {}
}
