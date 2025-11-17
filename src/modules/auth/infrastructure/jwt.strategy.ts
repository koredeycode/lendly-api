import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthRepository } from '../domain/auth.repository';

type Payload = {
  sub: string;
  email: string;
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authRepo: AuthRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: Payload) {
    // payload contains sub (user id) and email
    console.log({ payload });
    const user = await this.authRepo.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user; // will be attached to req.user
  }
}
