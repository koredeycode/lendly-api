import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JobsModule } from 'src/modules/jobs/presentation/job.module';
import { UserModule } from 'src/modules/user/presentation/user.module';
import { WalletModule } from 'src/modules/wallet/presentation/wallet.module';
import { GoogleLoginUseCase } from '../application/google-login.usecase';
import { LoginUseCase } from '../application/login.usecase';
import { ProfileUseCase } from '../application/profile.usecase';
import { SignupUseCase } from '../application/signup.usecase';
import { AuthRepository } from '../domain/auth.repository';
import { DrizzleAuthRepository } from '../infrastructure/auth.repository.drizzle';
import { JwtStrategy } from '../infrastructure/jwt.strategy';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: (process.env.ACCESS_EXPIRES_IN as any) || '30d',
      },
    }),
    JobsModule,
    UserModule,
    WalletModule,
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    GoogleLoginUseCase,
    SignupUseCase,
    ProfileUseCase,
    {
      provide: AuthRepository,
      useClass: DrizzleAuthRepository,
    },

    JwtAuthGuard,
    JwtStrategy,
  ],
  exports: [AuthRepository, JwtAuthGuard],
})
export class AuthModule {}
