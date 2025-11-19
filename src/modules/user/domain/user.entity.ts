export class AuthUser {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly passwordHash?: string | null,

    public readonly avatarUrl?: string | null,
    public readonly oauthProvider?: string | null,
    public readonly oauthId?: string | null,
  ) {}
}
