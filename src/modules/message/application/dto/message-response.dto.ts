// message-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MessageDataDTO {
  @ApiProperty({
    description: 'Message ID',
    example: '09d6f478-67bb-46d5-a0d2-edacfd418a4e',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Booking ID',
    example: '09d6f478-67bb-46d5-a0d2-edacfd418a4e',
  })
  @Expose()
  bookingId: string;

  @ApiProperty({
    description: 'Sender ID',
    example: '09d6f478-67bb-46d5-a0d2-edacfd418a4e',
  })
  @Expose()
  senderId: string;

  @ApiProperty({
    description: 'Message text',
    example: 'Hello!',
  })
  @Expose()
  message: string;

  @ApiProperty({
    description: 'Photos',
    example: ['url1', 'url2'],
  })
  @Expose()
  photos: string[];

  @ApiProperty({
    description: 'Created at',
    example: '2025-11-29T08:00:00.000Z',
  })
  @Expose()
  createdAt: Date;
}

export class MessageResponseDTO {
  @ApiProperty({
    description: 'Response message',
    example: 'Message created successfully',
  })
  @Expose()
  message: string;

  @ApiProperty({ type: MessageDataDTO })
  @Expose()
  data: MessageDataDTO;
}

export class MessagesResponseDTO {
  @ApiProperty({
    description: 'Response message',
    example: 'Messages retrieved successfully',
  })
  @Expose()
  message: string;

  @ApiProperty({ type: [MessageDataDTO] })
  @Expose()
  data: MessageDataDTO[];
}
