// import { users } from '@koredeycode/lendly-types';
// import { users } from '@koredeycode/lendly-types/drizzle';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { eq } from 'drizzle-orm';
// import { db } from 'src/db/client';

// @Injectable()
// export class AuthService {
//   constructor(private jwtService: JwtService) {}

//   async googleLogin(googleUser: any) {
//     if (!googleUser) throw new UnauthorizedException();

//     let user = await db
//       .select()
//       .from(users)
//       .where(eq(users.email, googleUser.email))
//       .limit(1);

//     if (!user[0]) {
//       const [newUser] = await db
//         .insert(users)
//         .values({
//           email: googleUser.email,
//           name: googleUser.name,
//           avatarUrl: googleUser.avatarUrl,
//           oauthProvider: 'google',
//           oauthId: googleUser.googleId,
//         })
//         .returning();
//       user = [newUser];
//     }

//     const payload = { sub: user[0].id, email: user[0].email };
//     return {
//       accessToken: this.jwtService.sign(payload),
//       refreshToken: this.jwtService.sign(payload, {
//         secret: process.env.REFRESH_SECRET,
//         expiresIn: process.env.REFRESH_EXPIRES_IN,
//       }),
//       user: user[0],
//     };
//   }

//   async refreshToken(token: string) {
//     try {
//       const payload = this.jwtService.verify(token, {
//         secret: process.env.REFRESH_SECRET,
//       });
//       const newPayload = { sub: payload.sub, email: payload.email };
//       return {
//         accessToken: this.jwtService.sign(newPayload),
//       };
//     } catch {
//       throw new UnauthorizedException('Invalid refresh token');
//     }
//   }
// }
