import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import type { GoogleUserDTO } from '../application/dto/google-user.dto';
import type { LoginDTO } from '../application/dto/login.dto';
import type { SignupDTO } from '../application/dto/signup.dto';
import { GoogleLoginUseCase } from '../application/google-login.usecase';
import { LoginUseCase } from '../application/login.usecase';
import { ProfileUseCase } from '../application/profile.usecase';
import { SignupUseCase } from '../application/signup.usecase';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signupUseCase: SignupUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly googleLoginUseCase: GoogleLoginUseCase,
    private readonly profileUseCase: ProfileUseCase,
  ) {}

  @Post('signup')
  async signup(@Body() body: SignupDTO) {
    console.log({ body });
    return this.signupUseCase.execute(body.email, body.name, body.password);
  }

  @Post('login')
  async login(@Body() body: LoginDTO) {
    return this.loginUseCase.execute(body.email, body.password);
  }

  @Post('google')
  async googleLogin(@Body() body: GoogleUserDTO) {
    return this.googleLoginUseCase.execute(body); // typed DTO
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Request() req) {
    return this.profileUseCase.execute(req.user.id); // req.user from JWT
  }
}
