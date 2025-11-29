import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/modules/user/domain/user.repository';
import { WalletService } from 'src/modules/wallet/application/wallet.service';
import { GoogleUserDTO } from './dto/google-user.dto';

@Injectable()
export class GoogleLoginUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
    private readonly walletService: WalletService,
  ) {}

  async execute(dto: GoogleUserDTO) {
    if (!dto) throw new UnauthorizedException();

    let user = await this.userRepo.findUserByEmail(dto.email);

    if (!user) {
      user = await this.userRepo.createGoogleUser({
        // id: uuidv4(),
        email: dto.email,
        name: dto.name,
        avatarUrl: dto.avatarUrl ?? undefined,
        oauthProvider: dto.oauthProvider || 'google',
        oauthId: dto.oauthId,
      });

      // Create wallet for new user
      await this.walletService.createWallet(user.id);
    }

    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET!,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET!,
    });

    return { accessToken, refreshToken };
  }
}
