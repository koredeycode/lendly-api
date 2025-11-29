import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class TopUpDto {
  @ApiProperty({ description: 'Amount to top up in cents', example: 5000 })
  @IsNumber()
  amountCents: number;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Callback URL for payment redirection',
    example: 'https://lendly.app/payment/callback',
  })
  @IsString()
  @IsNotEmpty()
  callbackUrl: string;
}

export class AccountDetailsDto {
  @ApiProperty({ description: 'Bank code', example: '058' })
  @IsString()
  @IsNotEmpty()
  bankCode: string;

  @ApiProperty({ description: 'Account number', example: '0123456789' })
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty({
    required: false,
    description: 'Account name',
    example: 'John Doe',
  })
  @IsString()
  @IsOptional()
  accountName?: string;
}

export class WithdrawDto {
  @ApiProperty({ description: 'Amount to withdraw in cents', example: 5000 })
  @IsNumber()
  amountCents: number;

  @ApiProperty({ description: 'Recipient account details' })
  @ValidateNested()
  @Type(() => AccountDetailsDto)
  accountDetails: AccountDetailsDto;
}

export class VerifyPaymentDto {
  @ApiProperty({ description: 'Payment reference', example: 'ref_123456789' })
  @IsString()
  @IsNotEmpty()
  reference: string;
}

export class PaymentInitializationResponseDto {
  @ApiProperty({ description: 'Payment reference', example: 'ref_123456789' })
  reference: string;

  @ApiProperty({
    description: 'Authorization URL to redirect user to',
    example: 'https://checkout.paystack.com/...',
  })
  authorizationUrl: string;

  @ApiProperty({ description: 'External provider ID', example: 'ext_123' })
  externalId: string;
}

export class PaymentTransactionDto {
  @ApiProperty({ description: 'Transaction ID', example: 'uuid-...' })
  id: string;

  @ApiProperty({ description: 'User ID', example: 'uuid-...' })
  userId: string;

  @ApiProperty({ description: 'Amount in cents', example: 5000 })
  amountCents: number;

  @ApiProperty({ description: 'Currency code', example: 'NGN' })
  currency: string;

  @ApiProperty({ description: 'Payment provider', example: 'paystack' })
  provider: string;

  @ApiProperty({ description: 'Transaction type', example: 'deposit' })
  type: string;

  @ApiProperty({ description: 'Transaction status', example: 'success' })
  status: string;

  @ApiProperty({ description: 'Transaction reference', example: 'ref_123' })
  reference: string;

  @ApiProperty({
    description: 'External ID',
    example: 'ext_123',
    required: false,
  })
  externalId?: string;

  @ApiProperty({ description: 'Metadata', required: false })
  metadata?: any;

  @ApiProperty({ description: 'Created at timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at timestamp' })
  updatedAt: Date;
}

export class TopUpResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'Top-up initialized',
  })
  message: string;

  @ApiProperty({ type: PaymentInitializationResponseDto })
  data: PaymentInitializationResponseDto;
}

export class VerifyResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'Transaction verified',
  })
  message: string;

  @ApiProperty({ type: PaymentTransactionDto })
  data: PaymentTransactionDto;
}

export class WithdrawResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'Withdrawal requested',
  })
  message: string;

  @ApiProperty({ type: PaymentTransactionDto })
  data: PaymentTransactionDto;
}
