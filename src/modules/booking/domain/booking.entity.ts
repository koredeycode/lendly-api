import { bookingStatusEnum } from 'src/config/db/schema';

export class Booking {
  constructor(
    public readonly itemId: string,
    public readonly requestedFrom: Date,
    public readonly requestedTo: Date,
    public readonly rentalFeeCents: number,

    public readonly thankYouTipCents?: number,
    public readonly status?: (typeof bookingStatusEnum.enumValues)[number],
    public readonly actualReturnedAt?: Date,
    public readonly id?: string,
    public readonly borrowerId?: string,
  ) {}
}
