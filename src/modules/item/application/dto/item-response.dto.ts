// item-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ItemOwnerDTO {
  @ApiProperty({
    description: 'Owner ID',
    example: '09d6f478-67bb-46d5-a0d2-edacfd418a4e',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Owner Name',
    example: 'John Doe',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Owner Trust Score',
    example: 4.5,
  })
  @Expose()
  trustScore: number;

  @ApiProperty({
    description: 'Owner Avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  @Expose()
  avatarUrl: string;
}

export class ItemDataDTO {
  @ApiProperty({
    description: 'Item ID',
    example: '09d6f478-67bb-46d5-a0d2-edacfd418a4e',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Item title',
    example: 'Baby clothes',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'Item category',
    example: 'Clothes',
  })
  @Expose()
  category: string;

  @ApiProperty({
    description: 'Item photos',
    example: ['url1', 'url2'],
  })
  @Expose()
  photos: string[];

  @ApiProperty({
    description: 'Item location coordinates',
    example: [88, 98],
  })
  @Expose()
  location: number[];

  @ApiProperty({
    description: 'Item location text',
    example: 'Ibadan',
  })
  @Expose()
  locationText: string;

  @ApiProperty({
    description: 'Daily rental price in cents',
    example: 100,
  })
  @Expose()
  dailyRentalPriceCents: number;

  @ApiProperty({
    description: 'Is item available',
    example: true,
  })
  @Expose()
  isAvailable: boolean;

  @ApiProperty({
    description: 'Is item permanent give',
    example: true,
  })
  @Expose()
  isPermanentGive: boolean;

  @ApiProperty({
    description: 'Item description',
    example: 'Description',
  })
  @Expose()
  description: string;

  @ApiProperty({
    description: 'Suggested tip',
    example: 'Prayers',
  })
  @Expose()
  suggestedTip: string;

  @ApiProperty({
    description: 'Owner ID',
    example: '09d6f478-67bb-46d5-a0d2-edacfd418a4e',
  })
  @Expose()
  ownerId: string;

  @ApiProperty({ type: ItemOwnerDTO })
  @Expose()
  owner: ItemOwnerDTO;

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

export class ItemResponseDTO {
  @ApiProperty({
    description: 'Response message',
    example: 'Item retrieved successfully',
  })
  @Expose()
  message: string;

  @ApiProperty({ type: ItemDataDTO })
  @Expose()
  data: ItemDataDTO;
}

export class ItemsResponseDTO {
  @ApiProperty({
    description: 'Response message',
    example: 'Items retrieved successfully',
  })
  @Expose()
  message: string;

  @ApiProperty({ type: [ItemDataDTO] })
  @Expose()
  data: ItemDataDTO[];
}
