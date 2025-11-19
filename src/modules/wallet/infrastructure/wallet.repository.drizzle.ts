import { Injectable } from '@nestjs/common';
import { WalletRepository } from '../domain/wallet.repository';

@Injectable()
export class DrizzleWalletRepository implements WalletRepository {}
