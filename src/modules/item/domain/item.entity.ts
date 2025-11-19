export class Item {
  constructor(
    public readonly location: [number, number],
    public readonly title: string,
    public readonly category: string,
    public readonly photos: string[],
    public readonly isAvailable: boolean,
    public readonly isPermanentGive: boolean,

    public dailyRentalPriceCents: number,
    public readonly locationText?: string,
    public readonly description?: string,
    public readonly suggestedTip?: string,
    public readonly id?: string,
    public readonly ownerId?: string,
  ) {}
}

// export const zItem = z.object({
//   id: z.string().uuid(),
//   ownerId: z.string().uuid(),
//   title: z.string().min(1).max(100),
//   description: z.string().optional(),
//   category: z.string().min(1),
//   photos: z.array(z.string().url()).default([]),
//   isPermanentGive: z.boolean().default(false),
//   isAvailable: z.boolean().default(true),
//   dailyRentalPriceCents: z.number().int().min(0).default(0), // 0 = free
//   suggestedTip: z.string().optional(),
//   location: zLocation,
//   locationText: z.string().optional(),
//   createdAt: z.date(),
//   updatedAt: z.date(),
//   deletedAt: z.date().nullable().optional(),
// });
