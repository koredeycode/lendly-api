import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDTO {
  @ApiPropertyOptional({
    description: 'An optional comment on the booking',
    example: 'Warra booking',
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({
    description: 'rating for the review',
    example: 100,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: 1 | 2 | 3 | 4 | 5;
}
