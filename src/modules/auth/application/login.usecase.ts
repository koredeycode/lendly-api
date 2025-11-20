import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/modules/user/domain/user.repository';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDTO) {
    const user = await this.userRepo.findUserByEmail(dto.email);
    if (!user) throw new UnauthorizedException('User not found');

    // verify hashed password
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash || '',
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

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
