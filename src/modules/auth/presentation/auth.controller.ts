import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { GoogleUserDTO } from '../application/dto/google-user.dto';
import { LoginResponseDTO } from '../application/dto/login-response.dto';
import { LoginDTO } from '../application/dto/login.dto';
import { ProfileResponseDTO } from '../application/dto/profile-response.dto';
import { SignupResponseDTO } from '../application/dto/signup-response.dto';
import { SignupDTO } from '../application/dto/signup.dto';
import { GoogleLoginUseCase } from '../application/google-login.usecase';
import { LoginUseCase } from '../application/login.usecase';
import { ProfileUseCase } from '../application/profile.usecase';
import { SignupUseCase } from '../application/signup.usecase';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly signupUseCase: SignupUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly googleLoginUseCase: GoogleLoginUseCase,
    private readonly profileUseCase: ProfileUseCase,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'Signup successful',
    type: SignupResponseDTO,
  })
  @Post('signup')
  async signup(@Body() body: SignupDTO) {
    await this.signupUseCase.execute(body.email, body.name, body.password);
    return { message: 'Signup successful' };
  }

  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDTO,
  })
  @Throttle({ default: { limit: 3, ttl: 6000 } })
  @Post('login')
  async login(@Body() body: LoginDTO) {
    const data = await this.loginUseCase.execute(body.email, body.password);

    return {
      message: 'Login successful',
      data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Google Login successful',
    type: LoginResponseDTO,
  })
  @Post('google')
  async googleLogin(@Body() body: GoogleUserDTO) {
    const data = await this.googleLoginUseCase.execute(body); // typed DTO
    return {
      message: 'Google Signin successful',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved',
    type: ProfileResponseDTO,
  })
  @ApiBearerAuth()
  async profile(@Request() req) {
    const user = await this.profileUseCase.execute(req.user.id);

    return { message: 'Profile retrieved successfully', data: user };
  }
}
