import { Injectable } from '@nestjs/common';
import { WalletRepository } from '../domain/wallet.repository';

@Injectable()
export class EditWalletUseCase {
  constructor(private readonly walletRepo: WalletRepository) {}

  async execute() {}
}
