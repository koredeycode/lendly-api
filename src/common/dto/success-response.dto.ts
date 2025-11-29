// success-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SuccessResponseDTO {
  @ApiProperty({
    description: 'Response message',
    example: 'Operation successful',
  })
  @Expose()
  message: string;
}
