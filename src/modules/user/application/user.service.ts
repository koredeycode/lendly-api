import { Injectable } from '@nestjs/common';
import { UserRepository } from '../domain/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}
}
