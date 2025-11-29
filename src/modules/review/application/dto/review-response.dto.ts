// review-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReviewDataDTO {
  @ApiProperty({
    description: 'Review ID',
    example: '09d6f478-67bb-46d5-a0d2-edacfd418a4e',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Booking ID',
    example: '09d6f478-67bb-46d5-a0d2-edacfd418a4e',
  })
  @Expose()
  bookingId: string;

  @ApiProperty({
    description: 'Reviewer ID',
    example: '09d6f478-67bb-46d5-a0d2-edacfd418a4e',
  })
  @Expose()
  reviewerId: string;

  @ApiProperty({
    description: 'Reviewee ID',
    example: '09d6f478-67bb-46d5-a0d2-edacfd418a4e',
  })
  @Expose()
  revieweeId: string;

  @ApiProperty({
    description: 'Comment',
    example: 'Great experience!',
  })
  @Expose()
  comment: string;

  @ApiProperty({
    description: 'Rating',
    example: 5,
  })
  @Expose()
  rating: number;

  @ApiProperty({
    description: 'Created at',
    example: '2025-11-29T08:00:00.000Z',
  })
  @Expose()
  createdAt: Date;
}

export class ReviewResponseDTO {
  @ApiProperty({
    description: 'Response message',
    example: 'Review created successfully',
  })
  @Expose()
  message: string;

  @ApiProperty({ type: ReviewDataDTO })
  @Expose()
  data: ReviewDataDTO;
}

export class ReviewsResponseDTO {
  @ApiProperty({
    description: 'Response message',
    example: 'Reviews retrieved successfully',
  })
  @Expose()
  message: string;

  @ApiProperty({ type: [ReviewDataDTO] })
  @Expose()
  data: ReviewDataDTO[];
}
