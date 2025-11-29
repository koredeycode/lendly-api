// availability-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AvailabilityDataDTO {
  @ApiProperty({
    description: 'Is item available',
    example: true,
  })
  @Expose()
  isAvailable: boolean;
}

export class AvailabilityResponseDTO {
  @ApiProperty({
    description: 'Response message',
    example: 'Availability checked successfully',
  })
  @Expose()
  message: string;

  @ApiProperty({ type: AvailabilityDataDTO })
  @Expose()
  data: AvailabilityDataDTO;
}
