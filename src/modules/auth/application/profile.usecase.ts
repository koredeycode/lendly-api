import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../domain/auth.repository';

@Injectable()
export class ProfileUseCase {
  constructor(private readonly authRepo: AuthRepository) {}

  async execute(userId: string) {
    const user = await this.authRepo.findById(userId);
    return { message: 'Profile retrieved successfully', data: user };
  }
}
