import { AuthUser } from './user.entity';

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<AuthUser | null>;
  abstract findById(id: string): Promise<AuthUser | null>;
  abstract createUser(user: AuthUser): Promise<AuthUser>;
  abstract createGoogleUser(data: AuthUser): Promise<AuthUser>;
}
