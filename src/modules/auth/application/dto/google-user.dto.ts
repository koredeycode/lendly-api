// google-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class GoogleUserDTO {
  @ApiProperty({
    description: 'User email',
    example: 'koredey4u@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User name',
    example: 'koredey4u@gmail.com',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User avatar',
    example: 'res.cloudinary.com',
  })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({
    description: 'User googleId',
    example: 'some id by google',
  })
  @IsString()
  oauthId: string;

  @ApiProperty({
    description: 'User googleId',
    example: 'some id by google',
  })
  @IsString()
  oauthProvider: string;
}
