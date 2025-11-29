import { Injectable, NotFoundException } from '@nestjs/common';
import { IPaymentProvider } from '../../domain/payment.provider.interface';
import { FlutterwaveProvider } from './flutterwave.provider';
import { MonnifyProvider } from './monnify.provider';
import { PaystackProvider } from './paystack.provider';
import { StripeProvider } from './stripe.provider';

@Injectable()
export class PaymentFactory {
  constructor(
    private readonly paystackProvider: PaystackProvider,
    private readonly stripeProvider: StripeProvider,
    private readonly flutterwaveProvider: FlutterwaveProvider,
    private readonly monnifyProvider: MonnifyProvider,
  ) {}

  getProvider(provider: string): IPaymentProvider {
    switch (provider) {
      case 'paystack':
        return this.paystackProvider;
      case 'stripe':
        return this.stripeProvider;
      case 'flutterwave':
        return this.flutterwaveProvider;
      case 'monnify':
        return this.monnifyProvider;
      default:
        throw new NotFoundException(
          `Payment provider ${provider} not supported`,
        );
    }
  }
}
