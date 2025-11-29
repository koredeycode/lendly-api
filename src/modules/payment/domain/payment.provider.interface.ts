
export interface InitializePaymentDto {
  amountCents: number;
  email: string;
  currency: string;
  metadata?: any;
  callbackUrl?: string;
}

export interface PaymentInitializationResponse {
  reference: string;
  authorizationUrl: string;
  externalId?: string;
}

export interface PaymentVerificationResponse {
  status: 'success' | 'failed' | 'pending';
  amountCents: number;
  currency: string;
  reference: string;
  externalId?: string;
  metadata?: any;
}

export interface TransferFundsDto {
  amountCents: number;
  currency: string;
  recipientAccount: {
    bankCode: string;
    accountNumber: string;
    accountName?: string;
  };
  reason?: string;
  reference?: string;
}

export interface TransferResponse {
  status: 'success' | 'failed' | 'pending';
  reference: string;
  externalId?: string;
  message?: string;
}

export interface WebhookEvent {
  type: 'deposit' | 'withdrawal';
  status: 'success' | 'failed';
  reference: string;
  externalId?: string;
  metadata?: any;
}

export interface IPaymentProvider {
  initializePayment(dto: InitializePaymentDto): Promise<PaymentInitializationResponse>;
  verifyPayment(reference: string): Promise<PaymentVerificationResponse>;
  transferFunds(dto: TransferFundsDto): Promise<TransferResponse>;
  validateWebhook(payload: any, signature: string): boolean;
  getWebhookEvent(payload: any, signature: string): Promise<WebhookEvent | null>;
}
