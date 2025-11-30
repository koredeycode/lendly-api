import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PublicUserDataDTO {
  @ApiProperty({
    description: 'User ID',
    example: '09d6f478-67bb-46d5-a0d2-edacfd418a4e',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'User name',
    example: 'yusuf',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://res.cloudinary.com/...',
  })
  @Expose()
  avatarUrl: string;

  @ApiProperty({
    description: 'User bio',
    example: 'I love lending items!',
  })
  @Expose()
  bio: string;

  @ApiProperty({
    description: 'User trust score',
    example: 100,
  })
  @Expose()
  trustScore: number;

  @ApiProperty({
    description: 'Created at',
    example: '2025-11-29T08:00:00.000Z',
  })
  @Expose()
  createdAt: Date;
}

export class PublicUserResponseDTO {
  @ApiProperty({
    description: 'Response message',
    example: 'User details retrieved successfully',
  })
  @Expose()
  message: string;

  @ApiProperty({ type: PublicUserDataDTO })
  @Expose()
  data: PublicUserDataDTO;
}
