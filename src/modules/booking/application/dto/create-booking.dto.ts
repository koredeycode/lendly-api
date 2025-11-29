import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateBookingDTO {
  // @ApiProperty({
  //   description: 'The unique ID of the item being booked (UUID format).',
  //   example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  // })
  // @IsUUID()
  // itemId: string;

  @ApiProperty({
    description: 'The requested start date of the rental period.',
    example: '2025-12-10T10:00:00.000Z',
    type: String, // Use String for DateString in Swagger UI
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  requestedFrom: Date; // The runtime type is Date after transformation, but validated as a string

  @ApiProperty({
    description: 'The requested end date of the rental period.',
    example: '2025-12-15T10:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  requestedTo: Date;

  @ApiProperty({
    description: 'The agreed rental fee in cents (e.g., 500 for $5.00).',
    example: 500,
  })
  @IsInt()
  @Min(0)
  rentalFeeCents: number;

  @ApiPropertyOptional({
    description: 'An optional message from the borrower to the lender.',
    example: 'I need this for a weekend trip. Will handle with care!',
  })
  @IsOptional()
  @IsString()
  message?: string;

  // Note: thankYouTipCents will likely be collected later, or defaulted to 0 on creation
  // If you want to allow the user to submit an initial tip amount:
  @ApiPropertyOptional({
    description: 'Optional initial tip amount in cents for the lender.',
    example: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  thankYouTipCents?: number;
}
