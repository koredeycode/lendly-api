export class Review {
  constructor(
    public readonly bookingId: string,
    public readonly reviewerId: string,
    public readonly revieweeId: string,

    public readonly rating: 1 | 2 | 3 | 4 | 5,

    public readonly comment?: string,
  ) {}
}

// export const zReview = z.object({
//   id: z.string().uuid(),
//   bookingId: z.string().uuid(),
//   reviewerId: z.string().uuid(),
//   revieweeId: z.string().uuid(),
//   rating: z.number().int().min(1).max(5),
//   comment: z.string().max(1000).optional(),
//   createdAt: z.date(),
// });
