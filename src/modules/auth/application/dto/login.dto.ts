// login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    description: 'User email',
    example: 'koredey4u@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'yusuf123',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
