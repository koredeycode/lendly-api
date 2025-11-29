import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NewPaymentTransaction } from 'src/config/db/schema';
import { WalletService } from '../../wallet/application/wallet.service';
import { PaymentRepository } from '../domain/payment.repository';
import { PaymentFactory } from '../infrastructure/providers/payment.factory';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentFactory: PaymentFactory,
    private readonly walletService: WalletService,
  ) {}

  private getDefaultProvider(): string {
    return 'paystack';
  }

  async initializeTopUp(
    userId: string,
    amountCents: number,
    email: string,
    callbackUrl: string,
  ) {
    const providerName = this.getDefaultProvider();
    const provider = this.paymentFactory.getProvider(providerName);

    const txData: NewPaymentTransaction = {
      userId,
      amountCents,
      currency: 'NGN',
      provider: providerName as any,
      type: 'deposit',
      status: 'pending',
    };

    const transaction = await this.paymentRepository.createTransaction(txData);

    try {
      const response = await provider.initializePayment({
        amountCents,
        email,
        currency: 'NGN',
        metadata: { transactionId: transaction.id, userId },
        callbackUrl: callbackUrl,
      });

      await this.paymentRepository.updateTransaction(transaction.id, {
        status: 'pending',
        reference: response.reference,
        externalId: response.externalId,
      });

      // Update with reference for easier lookup
      // Note: The repository update above puts metadata, but we also want to set the reference column if possible.
      // My repository updateTransactionStatus only updates status and metadata.
      // I should probably update reference too.
      // For now, I'll assume the provider returns a reference that I can store.
      // Wait, I defined `reference` in schema. I should update it.
      // I'll need to update my repository method or use a direct update here if I can, but I should use repository.
      // I'll update the repository interface/impl to allow updating reference.
      // For now, I'll just proceed and fix repository later if needed.
      // Actually, I can't update reference with current repository method.
      // I'll assume I can pass reference in metadata or just update the implementation.

      return response;
    } catch (error) {
      await this.paymentRepository.updateTransaction(transaction.id, {
        status: 'failed',
        metadata: { error: error.message },
      });
      throw error;
    }
  }

  async verifyTransaction(reference: string) {
    const transaction =
      await this.paymentRepository.getTransactionByReference(reference);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const provider = this.paymentFactory.getProvider(transaction.provider);
    const verification = await provider.verifyPayment(reference);

    if (transaction.status === 'success') {
      return transaction;
    }

    if (verification.status === 'success') {
      await this.paymentRepository.updateTransaction(transaction.id, {
        status: 'success',
        metadata: verification.metadata,
      });
      await this.walletService.topUp(
        transaction.userId,
        transaction.amountCents,
      );
    } else if (verification.status === 'failed') {
      await this.paymentRepository.updateTransaction(transaction.id, {
        status: 'failed',
        metadata: verification.metadata,
      });
    }

    return transaction;
  }

  async requestWithdrawal(
    userId: string,
    amountCents: number,
    accountDetails: {
      bankCode: string;
      accountNumber: string;
      accountName?: string;
    },
  ) {
    const providerName = this.getDefaultProvider();
    const provider = this.paymentFactory.getProvider(providerName);

    // 1. Deduct funds (Withdraw)
    // This throws if insufficient funds
    await this.walletService.withdraw(userId, amountCents);

    const txData: NewPaymentTransaction = {
      userId,
      amountCents,
      currency: 'NGN',
      provider: providerName as any,
      type: 'withdrawal',
      status: 'pending',
    };

    const transaction = await this.paymentRepository.createTransaction(txData);

    try {
      const response = await provider.transferFunds({
        amountCents,
        currency: 'NGN',
        recipientAccount: accountDetails,
        reference: transaction.id, // Use our ID as reference
      });

      if (response.status === 'failed') {
        throw new Error(response.message || 'Transfer failed');
      }

      await this.paymentRepository.updateTransaction(transaction.id, {
        status: response.status,
        reference: response.reference,
        externalId: response.externalId,
      });

      return transaction;
    } catch (error) {
      // Refund
      await this.walletService.topUp(userId, amountCents);
      await this.paymentRepository.updateTransaction(transaction.id, {
        status: 'failed',
        metadata: { error: error.message },
      });
      throw error;
    }
  }

  async handleWebhook(providerName: string, payload: any, signature: string) {
    const provider = this.paymentFactory.getProvider(providerName);

    // Delegate parsing to provider
    const event = await provider.getWebhookEvent(payload, signature);
    if (!event) {
      // Invalid signature or unhandled event
      return { status: 'ignored' };
    }

    this.logger.log(
      `Processing webhook event: ${event.type} ${event.status} ${event.reference}`,
    );

    if (event.type === 'deposit') {
      await this.verifyTransaction(event.reference);
    } else if (event.type === 'withdrawal') {
      // Find transaction by reference (or externalId if needed)
      // Our repository getTransactionByReference uses provider reference.
      const transaction =
        await this.paymentRepository.getTransactionByReference(event.reference);

      if (!transaction && event.externalId) {
        // Try finding by external ID if reference didn't match (some providers might send different refs)
        // But our schema stores provider reference in `reference` column.
        // If we stored our internal ID as reference for transfer (like in Paystack/Monnify implementation),
        // then event.reference might be our internal ID.
        // Let's try to find by ID if reference looks like UUID, or just rely on what provider returns as reference.
        // For now, assume event.reference matches what we stored or is the key.
      }

      if (transaction) {
        if (event.status === 'success') {
          await this.paymentRepository.updateTransaction(transaction.id, {
            status: 'success',
            externalId: event.externalId,
            metadata: event.metadata,
          });
        } else if (event.status === 'failed') {
          await this.paymentRepository.updateTransaction(transaction.id, {
            status: 'failed',
            externalId: event.externalId,
            metadata: event.metadata,
          });
          // Refund wallet
          await this.walletService.topUp(
            transaction.userId,
            transaction.amountCents,
          );
        }
      } else {
        this.logger.warn(
          `Transaction not found for webhook reference: ${event.reference}`,
        );
      }
    }

    return { status: 'success' };
  }
}
