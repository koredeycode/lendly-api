
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class TopUpDto {
  @ApiProperty()
  @IsNumber()
  amountCents: number;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  callbackUrl: string;
}

export class AccountDetailsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  bankCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  accountName?: string;
}

export class WithdrawDto {
  @ApiProperty()
  @IsNumber()
  amountCents: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => AccountDetailsDto)
  accountDetails: AccountDetailsDto;
}

export class VerifyPaymentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reference: string;
}
