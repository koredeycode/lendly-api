import { User } from './user.entity';

export abstract class UserRepository {
  abstract findUserByEmail(email: string): Promise<User | null>;
  abstract findUserById(id: string): Promise<User | null>;
  abstract createUser(user: User): Promise<User>;
  abstract createGoogleUser(data: User): Promise<User>;
  abstract updateUser(id: string, data: Partial<User>);

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
