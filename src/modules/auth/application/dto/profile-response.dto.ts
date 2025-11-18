// profile-response.dto.ts
import { Expose } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';

export class ProfileDataDTO {
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
    description: 'User email',
    example: 'koredey4u@gmail.com',
  })
  @Expose()
  email: string;
}

export class ProfileResponseDTO {
  @ApiProperty({
    description: 'Response message',
    example: 'Profile retrieved successfully',
  })
  @Expose()
  message: string;

  @ApiProperty({ type: ProfileDataDTO })
  @Expose()
  data: ProfileDataDTO;
}
