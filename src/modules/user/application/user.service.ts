import { Injectable } from '@nestjs/common';
import { UserRepository } from '../domain/user.repository';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async findUserById(id: string) {
    return this.userRepo.findUserById(id);
  }

  async findUserByEmail(email: string) {
    return await this.userRepo.findUserByEmail(email);
  }

  async updateUser(id: string, data: UpdateUserDTO) {
    return await this.userRepo.updateUser(id, data);
  }
}
