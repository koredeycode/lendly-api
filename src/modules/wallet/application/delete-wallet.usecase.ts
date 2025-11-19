import { Injectable } from '@nestjs/common';
import { WalletRepository } from '../domain/wallet.repository';

@Injectable()
export class DeleteWalletUseCase {
  constructor(private readonly walletRepo: WalletRepository) {}

  async execute() {}
}
