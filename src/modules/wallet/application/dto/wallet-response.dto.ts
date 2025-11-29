// wallet-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class WalletDataDTO {
  @ApiProperty({
    description: 'Wallet ID',
    example: '09d6f478-67bb-46d5-a0d2-edacfd418a4e',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'User ID',
    example: '09d6f478-67bb-46d5-a0d2-edacfd418a4e',
  })
  @Expose()
  userId: string;

  @ApiProperty({
    description: 'Balance in cents',
    example: 1000,
  })
  @Expose()
  balanceCents: number;

  @ApiProperty({
    description: 'Currency',
    example: 'USD',
  })
  @Expose()
  currency: string;

  @ApiProperty({
    description: 'Created at',
    example: '2025-11-29T08:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Updated at',
    example: '2025-11-29T08:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;
}

export class WalletResponseDTO {
  @ApiProperty({
    description: 'Response message',
    example: 'Wallet retrieved successfully',
  })
  @Expose()
  message: string;

  @ApiProperty({ type: WalletDataDTO })
  @Expose()
  data: WalletDataDTO;
}
