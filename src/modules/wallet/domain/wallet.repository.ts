export abstract class WalletRepository {
  abstract getWallet();
  abstract createWalletIfNotExists();
  abstract addWalletTransaction();
}
