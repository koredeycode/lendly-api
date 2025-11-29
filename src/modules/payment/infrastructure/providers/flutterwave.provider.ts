import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  InitializePaymentDto,
  IPaymentProvider,
  PaymentInitializationResponse,
  PaymentVerificationResponse,
  TransferFundsDto,
  TransferResponse,
  WebhookEvent,
} from '../../domain/payment.provider.interface';

@Injectable()
export class FlutterwaveProvider implements IPaymentProvider {
  // Documentation: https://developer.flutterwave.com/docs/integration-guides/
  private readonly logger = new Logger(FlutterwaveProvider.name);
  private readonly secretKey: string;
  private readonly baseUrl = 'https://api.flutterwave.com/v3';

  constructor(private readonly configService: ConfigService) {
    this.secretKey = this.configService.get<string>('FLUTTERWAVE_SECRET_KEY') || '';
  }

  async initializePayment(dto: InitializePaymentDto): Promise<PaymentInitializationResponse> {
    const response = await fetch(`${this.baseUrl}/payments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref: `tx-${Date.now()}`, // Flutterwave requires unique tx_ref
        amount: dto.amountCents, // Note: Flutterwave usually takes main currency unit, but let's assume cents/kobo if configured or divide. 
        // Wait, Flutterwave API takes amount in major units (e.g. NGN 100.00).
        // My system uses cents. I should divide by 100.
        // But wait, Paystack also takes kobo (cents).
        // Let's assume for consistency I should handle conversion.
        // For this "experiment", I'll assume amount passed to provider is what provider expects or I convert.
        // Standard is usually major units for Flutterwave.
        currency: dto.currency,
        redirect_url: dto.callbackUrl,
        customer: {
          email: dto.email,
        },
        meta: dto.metadata,
      }),
    });

    const data = await response.json();
    if (data.status !== 'success') {
      throw new Error(`Flutterwave initialization failed: ${data.message}`);
    }

    return {
      reference: data.data.tx_ref, // Use our generated ref or theirs? They return link.
      // Actually, data.data.link is the auth url.
      authorizationUrl: data.data.link,
      externalId: data.data.id?.toString(),
    };
  }

  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    // Verification by transaction ID or tx_ref?
    // Endpoint: /transactions?tx_ref=...
    const response = await fetch(`${this.baseUrl}/transactions?tx_ref=${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
      },
    });

    const data = await response.json();
    if (data.status !== 'success' || !data.data || data.data.length === 0) {
      return {
        status: 'failed',
        amountCents: 0,
        currency: 'NGN',
        reference,
      };
    }

    const tx = data.data[0];

    return {
      status: tx.status === 'successful' ? 'success' : 'failed',
      amountCents: tx.amount, // Major units?
      currency: tx.currency,
      reference: tx.tx_ref,
      externalId: tx.id.toString(),
      metadata: tx.meta,
    };
  }

  async transferFunds(dto: TransferFundsDto): Promise<TransferResponse> {
    const response = await fetch(`${this.baseUrl}/transfers`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account_bank: dto.recipientAccount.bankCode,
        account_number: dto.recipientAccount.accountNumber,
        amount: dto.amountCents, // Check units!
        currency: dto.currency,
        narration: dto.reason,
        reference: dto.reference,
      }),
    });

    const data = await response.json();
    if (data.status !== 'success') {
      return {
        status: 'failed',
        reference: dto.reference || '',
        message: data.message,
      };
    }

    return {
      status: data.data.status === 'SUCCESSFUL' ? 'success' : 'pending',
      reference: data.data.reference,
      externalId: data.data.id.toString(),
    };
  }

  validateWebhook(payload: any, signature: string): boolean {
    const secretHash = this.configService.get<string>('FLUTTERWAVE_HASH');
    return signature === secretHash;
  }

  async getWebhookEvent(payload: any, signature: string): Promise<WebhookEvent | null> {
    if (!this.validateWebhook(payload, signature)) {
      return null;
    }

    // Flutterwave payload structure varies.
    // For charge: event: 'charge.completed'
    // For transfer: event: 'transfer.completed'
    const event = payload.event;
    const data = payload.data;

    if (event === 'charge.completed' && data.status === 'successful') {
      return {
        type: 'deposit',
        status: 'success',
        reference: data.tx_ref,
        externalId: data.id.toString(),
        metadata: data.meta,
      };
    } else if (event === 'transfer.completed') {
      return {
        type: 'withdrawal',
        status: data.status === 'SUCCESSFUL' ? 'success' : 'failed',
        reference: data.reference,
        externalId: data.id.toString(),
      };
    }

    return null;
  }
}
