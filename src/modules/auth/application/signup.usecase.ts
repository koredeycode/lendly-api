import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EmailJobService } from 'src/modules/jobs/application/email-job.service';
import { UserRepository } from 'src/modules/user/domain/user.repository';
import { SignupDTO } from './dto/signup.dto';

@Injectable()
export class SignupUseCase {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly emailJobs: EmailJobService,
  ) {}

  async execute(dto: SignupDTO) {
    // Check if user already exists
    const existingUser = await this.userRepo.findUserByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create new user
    await this.userRepo.createUser(
      {
        name: dto.email,
        email: dto.email,
      },
      passwordHash,
    );
    await this.emailJobs.sendWelcomeEmail({
      email: dto.email,
      name: dto.name,
    });
    // // Generate JWT tokens
    // const payload = { sub: user.id, email: user.email };
    // const accessToken = await this.jwtService.signAsync(payload);
    // const refreshToken = await this.jwtService.signAsync(payload);

    // return { message: 'Signup successful' };
    // return { accessToken, refreshToken, user };
  }
}
