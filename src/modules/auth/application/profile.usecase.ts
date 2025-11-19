import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/modules/user/domain/user.repository';

@Injectable()
export class ProfileUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepo.findById(userId);
    return { message: 'Profile retrieved successfully', data: user };
  }
}
