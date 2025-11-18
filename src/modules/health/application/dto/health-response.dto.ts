// signup-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class HealthResponseDTO {
  @ApiProperty({
    description: 'Status',
    example: 'OK',
  })
  @Expose()
  status: string;

  @ApiProperty({
    description: 'TimeStamp',
    example: '2025-11-18T12:16:52.222Z',
  })
  @Expose()
  timestamp: string;
}
