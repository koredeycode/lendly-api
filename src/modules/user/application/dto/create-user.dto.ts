import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    description: 'User email',
    example: 'koredey4u@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User name',
    example: 'yusuf',
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'User Password',
    example: 'yusuf123',
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class CreateGoogleUserDTO {
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
  googleId: string;
}
