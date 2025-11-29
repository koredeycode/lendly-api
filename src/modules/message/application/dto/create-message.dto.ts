import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMessageDTO {
  @ApiProperty({
    description: 'The message text',
    example: 'When are you comming to get the item?',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Photos of the message',
    example: ['res.cloudinary'],
  })
  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  photos?: string[];
}
