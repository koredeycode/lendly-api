// user-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserDataDTO {
  @ApiProperty({
    description: 'User ID',
    example: '09d6f478-67bb-46d5-a0d2-edacfd418a4e',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'User email',
    example: 'koredey4u@gmail.com',
  })
  @Expose()
  email: string;

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

export class UserResponseDTO {
  @ApiProperty({
    description: 'Response message',
    example: 'User retrieved successfully',
  })
  @Expose()
  message: string;

  @ApiProperty({ type: UserDataDTO })
  @Expose()
  data: UserDataDTO;
}
