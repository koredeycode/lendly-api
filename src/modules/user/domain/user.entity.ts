export class User {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly passwordHash?: string | null,

    public readonly id?: string,

    public readonly avatarUrl?: string | null,
    public readonly oauthProvider?: string | null,
    public readonly oauthId?: string | null,
  ) {}
}
