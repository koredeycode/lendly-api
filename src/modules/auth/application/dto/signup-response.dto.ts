// signup-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SignupResponseDTO {
  @ApiProperty({
    description: 'Response message',
    example: 'Signup successful',
  })
  @Expose()
  message: string; // e.g., "Signup successful"
}
