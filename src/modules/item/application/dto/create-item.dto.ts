import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    ArrayMaxSize,
    ArrayMinSize,
    IsArray,
    IsBoolean,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';
import { itemCategoryEnum } from 'src/config/db/schema';

export class CreateItemDTO {
  @ApiProperty({
    description: 'The item title',
    example: 'Baby clothes to be given out',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'An optional category for the item',
    example: 'clothing',
    enum: itemCategoryEnum.enumValues,
  })
  // @IsOptional()
  @IsEnum(itemCategoryEnum.enumValues)
  category: string;

  @ApiProperty({
    description: 'Photos of the item',
    example: ['res.cloudinary'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  photos: string[];

  @ApiProperty({
    description: 'Latitude and longitude of the item',
    example: [88, 98],
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  location: [number, number];

  @ApiProperty({
    description: 'The item location',
    example: 'Ibadan',
  })
  @IsString()
  locationText: string;

  @ApiProperty({
    description: 'Daily rental price amount in cents for the lender.',
    example: 100,
  })
  @IsInt()
  @Min(0)
  dailyRentalPriceCents: number;

  @ApiProperty({
    description: 'Whether the item is available or not',
    example: true,
  })
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty({
    description: 'Whether the item is free or not',
    example: true,
  })
  @IsBoolean()
  isPermanentGive: boolean;

  @ApiPropertyOptional({
    description: 'An optional description for the item',
    example: 'New used not more than 7 months to support mothers',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'An optional suggestedTip for the giver',
    example: 'Prayers',
  })
  @IsOptional()
  @IsString()
  suggestedTip?: string;
}
