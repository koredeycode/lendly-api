import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { itemCategoryEnum } from 'src/config/db/schema';

export class SearchItemsDTO {
  @ApiProperty({
    description: 'latitude',
    example: 90,
  })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiProperty({
    description: 'longitude',
    example: 90,
  })
  @IsNumber()
  @IsOptional()
  lng?: number;

  @ApiProperty({
    description: 'kilometer radius',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  radiusKm?: number;

  @ApiProperty({
    description: 'The item category',
    example: 'clothing',
    enum: itemCategoryEnum.enumValues,
  })
  @IsEnum(itemCategoryEnum.enumValues)
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: 'Whether the item is available',
    example: true,
  })
  @IsBoolean()
  onlyAvailable?: boolean;

  @ApiProperty({
    description: 'Whether the item is free or not',
    example: true,
  })
  @IsBoolean()
  onlyFree?: boolean;

  @ApiProperty({
    description: 'The search term',
    example: 'clothings',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'Page number',
    example: 1,
  })
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Search limit',
    example: 10,
  })
  @IsInt()
  @Min(10)
  limit?: number;
}
