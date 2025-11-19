import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../domain/review.repository';

@Injectable()
export class DrizzleReviewRepository implements ReviewRepository {}
