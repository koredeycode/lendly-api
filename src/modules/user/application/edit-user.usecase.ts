import { Injectable } from '@nestjs/common';
import { UserRepository } from '../domain/user.repository';

@Injectable()
export class EditUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute() {}
}
