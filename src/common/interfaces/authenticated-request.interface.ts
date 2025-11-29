import { Request } from 'express';
import { User } from 'src/config/db/schema';

export interface AuthenticatedRequest extends Request {
  user: User;
}
