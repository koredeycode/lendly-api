import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../domain/auth.repository';

@Injectable()
export class DrizzleAuthRepository implements AuthRepository {}
