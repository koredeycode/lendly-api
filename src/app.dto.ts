// app.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class AppResponseDTO {
  @ApiProperty({
    description: 'Response message',
    example: 'Hello World!',
  })
  message: string;
}
