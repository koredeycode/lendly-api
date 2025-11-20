import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

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
