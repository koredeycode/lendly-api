import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EmailJobService } from 'src/modules/jobs/application/email-job.service';
import { v4 as uuidv4 } from 'uuid';
import { AuthUser } from '../domain/auth.entity';
import { AuthRepository } from '../domain/auth.repository';

@Injectable()
export class SignupUseCase {
  constructor(
    private readonly authRepo: AuthRepository,
    private readonly emailJobs: EmailJobService,
  ) {}

  async execute(email: string, name: string, password: string) {
    // Check if user already exists
    const existingUser = await this.authRepo.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    await this.authRepo.createUser(
      new AuthUser(uuidv4(), name, email, passwordHash),
    );
    await this.emailJobs.sendWelcomeEmail({
      email,
      name,
    });
    // // Generate JWT tokens
    // const payload = { sub: user.id, email: user.email };
    // const accessToken = await this.jwtService.signAsync(payload);
    // const refreshToken = await this.jwtService.signAsync(payload);

    return { message: 'Signup successful' };
    // return { accessToken, refreshToken, user };
  }
}
