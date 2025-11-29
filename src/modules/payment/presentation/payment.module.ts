import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WalletModule } from '../../wallet/presentation/wallet.module';
import { PaymentService } from '../application/payment.service';
import { PaymentRepository } from '../domain/payment.repository';
import { DrizzlePaymentRepository } from '../infrastructure/payment.repository.drizzle';
import { FlutterwaveProvider } from '../infrastructure/providers/flutterwave.provider';
import { MonnifyProvider } from '../infrastructure/providers/monnify.provider';
import { PaymentFactory } from '../infrastructure/providers/payment.factory';
import { PaystackProvider } from '../infrastructure/providers/paystack.provider';
import { StripeProvider } from '../infrastructure/providers/stripe.provider';
import { PaymentController } from './payment.controller';

@Module({
  imports: [ConfigModule, WalletModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentFactory,
    PaystackProvider,
    StripeProvider,
    FlutterwaveProvider,
    MonnifyProvider,
    {
      provide: PaymentRepository,
      useClass: DrizzlePaymentRepository,
    },
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
