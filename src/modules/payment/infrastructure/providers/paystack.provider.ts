import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
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
export class PaystackProvider implements IPaymentProvider {
  // Documentation: https://paystack.com/docs/api/
  private readonly logger = new Logger(PaystackProvider.name);
  private readonly secretKey: string;
  private readonly baseUrl = 'https://api.paystack.co';

  constructor(private readonly configService: ConfigService) {
    this.secretKey =
      this.configService.get<string>('PAYSTACK_SECRET_KEY') || '';
  }

  async initializePayment(
    dto: InitializePaymentDto,
  ): Promise<PaymentInitializationResponse> {
    const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: dto.email,
        amount: dto.amountCents, // Paystack takes amount in kobo (cents)
        currency: dto.currency,
        metadata: dto.metadata,
        callback_url: `${this.configService.get<string>('APP_URL')}/payments/callback?platform=${dto.platform}`,
      }),
    });

    const data = await response.json();
    if (!data.status) {
      throw new Error(`Paystack initialization failed: ${data.message}`);
    }
    console.log({paystackResponse: data})
    return {
      reference: data.data.reference,
      authorizationUrl: data.data.authorization_url,
      externalId: data.data.access_code,
    };
  }

  async verifyPayment(reference: string): Promise<PaymentVerificationResponse> {
    const response = await fetch(
      `${this.baseUrl}/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      },
    );

    const data = await response.json();
    if (!data.status) {
      return {
        status: 'failed',
        amountCents: 0,
        currency: 'NGN',
        reference,
      };
    }

    return {
      status: data.data.status === 'success' ? 'success' : 'failed',
      amountCents: data.data.amount,
      currency: data.data.currency,
      reference: data.data.reference,
      externalId: data.data.id.toString(),
      metadata: data.data.metadata,
    };
  }

  async transferFunds(dto: TransferFundsDto): Promise<TransferResponse> {
    // 1. Create Transfer Recipient
    const recipientResponse = await fetch(`${this.baseUrl}/transferrecipient`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'nuban',
        name: dto.recipientAccount.accountName || 'Recipient',
        account_number: dto.recipientAccount.accountNumber,
        bank_code: dto.recipientAccount.bankCode,
        currency: dto.currency,
      }),
    });

    const recipientData = await recipientResponse.json();
    if (!recipientData.status) {
      throw new Error(
        `Paystack recipient creation failed: ${recipientData.message}`,
      );
    }

    const recipientCode = recipientData.data.recipient_code;

    // 2. Initiate Transfer
    const transferResponse = await fetch(`${this.baseUrl}/transfer`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'balance',
        amount: dto.amountCents,
        recipient: recipientCode,
        reason: dto.reason,
        reference: dto.reference,
      }),
    });

    const transferData = await transferResponse.json();
    if (!transferData.status) {
      return {
        status: 'failed',
        reference: dto.reference || '',
        message: transferData.message,
      };
    }

    return {
      status: transferData.data.status === 'success' ? 'success' : 'pending',
      reference: transferData.data.reference,
      externalId: transferData.data.id.toString(),
    };
  }

  validateWebhook(payload: any, signature: string): boolean {
    const hash = crypto
      .createHmac('sha512', this.secretKey)
      .update(JSON.stringify(payload))
      .digest('hex');
    return hash === signature;
  }

  async getWebhookEvent(
    payload: any,
    signature: string,
  ): Promise<WebhookEvent | null> {
    if (!this.validateWebhook(payload, signature)) {
      return null;
    }

    console.dir(payload, { depth: null });

    const event = payload.event;
    const data = payload.data;

    if (event === 'charge.success') {
      return {
        type: 'deposit',
        status: 'success',
        reference: data.reference,
        externalId: data.id.toString(),
        metadata: data.metadata,
      };
    } else if (event === 'transfer.success') {
      return {
        type: 'withdrawal',
        status: 'success',
        reference: data.reference, // Assuming we sent our tx ID as reference
        externalId: data.id.toString(),
      };
    } else if (event === 'transfer.failed' || event === 'transfer.reversed') {
      return {
        type: 'withdrawal',
        status: 'failed',
        reference: data.reference,
        externalId: data.id.toString(),
      };
    }

    return null;
  }
}
