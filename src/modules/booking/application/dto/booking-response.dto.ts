// booking-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BookingDataDTO {
  @ApiProperty({
    description: 'Booking ID',
    example: '09d6f478-67bb-46d5-a0d2-edacfd418a4e',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Item ID',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @Expose()
  itemId: string;

  @ApiProperty({
    description: 'Borrower ID',
    example: '09d6f478-67bb-46d5-a0d2-edacfd418a4e',
  })
  @Expose()
  borrowerId: string;

  @ApiProperty({
    description: 'Requested start date',
    example: '2025-12-10T10:00:00.000Z',
  })
  @Expose()
  requestedFrom: Date;

  @ApiProperty({
    description: 'Requested end date',
    example: '2025-12-15T10:00:00.000Z',
  })
  @Expose()
  requestedTo: Date;

  @ApiProperty({
    description: 'Rental fee in cents',
    example: 500,
  })
  @Expose()
  rentalFeeCents: number;

  @ApiProperty({
    description: 'Booking status',
    example: 'PENDING',
  })
  @Expose()
  status: string;

  @ApiProperty({
    description: 'Created at',
    example: '2025-11-29T08:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Updated at',
    example: '2025-11-29T08:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;
}

export class BookingResponseDTO {
  @ApiProperty({
    description: 'Response message',
    example: 'Booking successfully retrieved',
  })
  @Expose()
  message: string;

  @ApiProperty({ type: BookingDataDTO })
  @Expose()
  data: BookingDataDTO;
}

export class BookingsResponseDTO {
  @ApiProperty({
    description: 'Response message',
    example: 'Bookings successfully retrieved',
  })
  @Expose()
  message: string;

  @ApiProperty({ type: [BookingDataDTO] })
  @Expose()
  data: BookingDataDTO[];
}
