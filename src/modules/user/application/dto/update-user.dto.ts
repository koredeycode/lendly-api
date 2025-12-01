import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDTO {
  //   @ApiProperty({
  //     description: 'User email',
  //     example: 'koredey4u@gmail.com',
  //   })
  //   @IsEmail()
  //   email: string;

  @ApiProperty({
    description: 'User name',
    example: 'yusuf',
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'User phone number',
    example: '08123456789',
  })
  @IsString()
  @IsOptional()
  @MinLength(10)
  phone: string;

  @ApiProperty({
    description: 'User bio',
    example: 'I am a software developer.',
  })
  @IsString()
  @IsOptional()
  bio: string;

  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  @IsString()
  @IsOptional()
  @MinLength(10)
  avatarUrl: string;

  //   @ApiProperty({
  //     description: 'User Password',
  //     example: 'yusuf123',
  //   })
  //   @IsString()
  //   @MinLength(6)
  //   password: string;
}
