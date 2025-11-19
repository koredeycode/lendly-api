import { AuthUser } from './user.entity';

export abstract class UserRepository {
  abstract findUserByEmail(email: string): Promise<AuthUser | null>;
  abstract findUserById(id: string): Promise<AuthUser | null>;
  abstract createUser(user: AuthUser): Promise<AuthUser>;
  abstract createGoogleUser(data: AuthUser): Promise<AuthUser>;
  abstract updateUser(id: string, data: Partial<AuthUser>);

  abstract upsertUserLocation(userId: string, lat: number, lng: number);

  abstract createReport(data: {
    reporterId: string;
    reportedUserId?: string;
    reportedItemId?: string;
    reason: string;
  });

  abstract upsertDeviceToken(
    userId: string,
    token: string,
    platform: 'ios' | 'android' | 'web',
  );

  abstract toggleSavedItem(userId: string, itemId: string);
  abstract unsaveItem(userId: string, itemId: string);
  abstract getSavedItems(userId: string);
}
