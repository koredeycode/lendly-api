import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class WalletTransactionDTO {
  @ApiProperty()
  @IsNumber()
  @Min(100)
  amountCents: number;
}
