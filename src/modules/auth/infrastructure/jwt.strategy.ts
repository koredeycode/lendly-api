import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from 'src/modules/user/domain/user.repository';

type Payload = {
  sub: string;
  email: string;
};
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepo: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: Payload) {
    // payload contains sub (user id) and email
    const user = await this.userRepo.findUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user; // will be attached to req.user
  }
}
