import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/modules/user/domain/user.repository';
import { v4 as uuidv4 } from 'uuid';
import { GoogleUserDTO } from './dto/google-user.dto';

@Injectable()
export class GoogleLoginUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(googleUser: GoogleUserDTO) {
    if (!googleUser) throw new UnauthorizedException();

    let user = await this.userRepo.findUserByEmail(googleUser.email);

    if (!user) {
      user = await this.userRepo.createGoogleUser({
        id: uuidv4(),
        email: googleUser.email,
        name: googleUser.name,
        avatarUrl: googleUser.avatarUrl ?? undefined,
        oauthProvider: 'google',
        oauthId: googleUser.googleId,
      });
    }

    const payload = { sub: user.id, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET!,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET!,
    });

    return {
      message: 'Google Signin successful',
      data: { accessToken, refreshToken },
    };
  }
}
