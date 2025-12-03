// Just re-export from lendly-types
// export * from '@koredeycode/lendly-types';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  geometry,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

// ======================= ENUMS =======================
export const bookingStatusEnum = pgEnum('booking_status', [
  'pending',
  'accepted',
  'picked_up',
  'returned', // only used for lending (not permanent give)
  'completed', // final state for permanent giveaways after pickup
  'cancelled',
  'overdue',
  'rejected',
]);

export const photoTypeEnum = pgEnum('photo_type', ['before', 'after']);
export const platformEnum = pgEnum('platform', ['ios', 'android', 'web']);
export const reportStatusEnum = pgEnum('report_status', [
  'pending',
  'reviewed',
  'banned',
]);

export const walletTransactionTypeEnum = pgEnum('wallet_transaction_type', [
  'deposit', // user added money
  'rental_payment', // borrower → platform/lender (rental fee)
  'tip_payment', // borrower → lender (thank you tip)
  'rental_receive', // lender receives rental fee
  'tip_receive', // lender receives tip
  'refund', // cancelled booking, dispute, etc.
  'withdrawal', // cash out to bank (future)
  'hold', // funds moved from available to frozen (booking request)
  'top_up', // user added money
  'release', // funds moved back from frozen to available (booking rejected/cancelled)
]);

// ======================= USERS =======================
export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').notNull(),
    passwordHash: text('password_hash'),
    name: text('name').notNull(),
    avatarUrl: text('avatar_url'),
    bio: text('bio'),
    phone: varchar('phone', { length: 20 }),
    phoneVerified: boolean('phone_verified').default(false),
    oauthProvider: text('oauth_provider'),
    oauthId: text('oauth_id'),
    trustScore: smallint('trust_score').default(10).$type<0 | 100>(),
    isActive: boolean('is_active').default(true),
    isBanned: boolean('is_banned').default(false),
    lastActiveAt: timestamp('last_active_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('idx_users_email_lower').on(sql`LOWER(${t.email})`),
    index('idx_users_trust_score').on(t.trustScore.desc()),
  ],
);

// Last known location
export const userLocations = pgTable('user_locations', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  location: geometry('location', { type: 'point', srid: 4326 }).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ======================= WALLETS =======================
export const wallets = pgTable('wallets', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  availableBalanceCents: bigint('available_balance_cents', { mode: 'number' })
    .default(0)
    .notNull(),
  frozenBalanceCents: bigint('frozen_balance_cents', { mode: 'number' })
    .default(0)
    .notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const walletTransactions = pgTable(
  'wallet_transactions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    walletId: uuid('wallet_id')
      .notNull()
      .references(() => wallets.userId, { onDelete: 'cascade' }),
    amountCents: bigint('amount_cents', { mode: 'number' }).notNull(), // negative = debit
    type: walletTransactionTypeEnum('type').notNull(),
    bookingId: uuid('booking_id').references(() => bookings.id, {
      onDelete: 'set null',
    }),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    index('idx_wallet_tx_wallet').on(t.walletId),
    index('idx_wallet_tx_booking').on(t.bookingId),
  ],
);

export const itemCategoryEnum = pgEnum('item_category', [
  'electronics',
  'tools',
  'clothing',
  'books',
  'sports_outdoors',
  'home_garden',
  'toys_games',
  'automotive',
  'baby_kids',
  'health_beauty',
  'musical_instruments',
  'office_supplies',
  'pet_supplies',
  'art_collectibles',
  'others',
]);

// ======================= ITEMS =======================
export const items = pgTable(
  'items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    category: itemCategoryEnum('category').notNull(),
    photos: text('photos')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    isPermanentGive: boolean('is_permanent_give').default(false),
    isAvailable: boolean('is_available').default(true).notNull(), // manual pause
    dailyRentalPriceCents: integer('daily_rental_price_cents')
      .notNull()
      .default(0), // 0 = free
    suggestedTip: text('suggested_tip'), // e.g., "A coffee would be appreciated"
    location: geometry('location', { type: 'point', srid: 4326 }).notNull(),
    locationText: text('location_text'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (t) => [
    index('idx_items_location').using('gist', t.location),
    index('idx_items_category').on(t.category),
    index('idx_items_available')
      .on(t.isAvailable)
      .where(sql`${t.isAvailable} = true`),
  ],
);

// Optional: blocked periods (vacation, repairs, etc.)
// export const itemBlockedPeriods = pgTable(
//   "item_blocked_periods",
//   {
//     id: uuid("id").defaultRandom().primaryKey(),
//     itemId: uuid("item_id")
//       .notNull()
//       .references(() => items.id, { onDelete: "cascade" }),
//     reason: text("reason"),
//     // period: tstzrange("period").notNull(),
//     period: text("period").notNull(),
//   },
//   (t) => [sql`EXCLUDE USING gist (item_id WITH =, period WITH &&)`]
// );

// ======================= BOOKINGS =======================
export const bookings = pgTable(
  'bookings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    itemId: uuid('item_id')
      .notNull()
      .references(() => items.id, { onDelete: 'cascade' }),
    borrowerId: uuid('borrower_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    // lenderId removed → always derived via items.owner_id

    status: bookingStatusEnum('status').default('pending').notNull(),

    requestedFrom: timestamp('requested_from', {
      withTimezone: true,
    }).notNull(),
    requestedTo: timestamp('requested_to', { withTimezone: true }).notNull(),

    rentalFeeCents: integer('rental_fee_cents').notNull().default(0),
    thankYouTipCents: integer('thank_you_tip_cents').default(0),
    totalChargedCents: integer('total_charged_cents').notNull().default(0),

    actualReturnedAt: timestamp('actual_returned_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    //prevent double booking
    sql`
      EXCLUDE USING gist (
        item_id WITH =,
        tstzrange(requested_from, requested_to, '[)') WITH &&
      ) WHERE (status IN ('accepted', 'picked_up'))
    `,
    index('idx_bookings_status').on(t.status),
    index('idx_bookings_borrower').on(t.borrowerId),
    index('idx_bookings_item').on(t.itemId),
  ],
);

// Condition photos (before/after pickup)
export const bookingPhotos = pgTable('booking_photos', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingId: uuid('booking_id')
    .notNull()
    .references(() => bookings.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  url: text('url').notNull(),
  type: photoTypeEnum('type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ======================= REVIEWS =======================
export const reviews = pgTable(
  'reviews',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    bookingId: uuid('booking_id')
      .notNull()
      .references(() => bookings.id, { onDelete: 'cascade' }),
    reviewerId: uuid('reviewer_id')
      .notNull()
      .references(() => users.id),
    // revieweeId removed as it can be derived from booking
    rating: smallint('rating').notNull().$type<1 | 2 | 3 | 4 | 5>(),
    comment: text('comment'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    unique('reviews_one_per_person_per_booking').on(t.bookingId, t.reviewerId),
  ],
);

// ======================= CHAT =======================
export const chatMessages = pgTable(
  'chat_messages',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    bookingId: uuid('booking_id')
      .notNull()
      .references(() => bookings.id, { onDelete: 'cascade' }),
    senderId: uuid('sender_id')
      .notNull()
      .references(() => users.id),
    message: text('message').notNull(),
    images: text('images')
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    // imageUrl: text("image_url"),
    isRead: boolean('is_read').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('idx_chat_booking').on(t.bookingId, t.createdAt.desc())],
);

// ======================= REPORTS & TOKENS =======================
export const reports = pgTable('reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  reporterId: uuid('reporter_id')
    .notNull()
    .references(() => users.id),
  reportedUserId: uuid('reported_user_id').references(() => users.id),
  reportedItemId: uuid('reported_item_id').references(() => items.id),
  reason: text('reason').notNull(),
  status: reportStatusEnum('status').default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const deviceTokens = pgTable(
  'device_tokens',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').notNull(),
    platform: platformEnum('platform').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.token] })],
);

// ======================= FAVORITES (bonus) =======================
export const savedItems = pgTable(
  'saved_items',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    itemId: uuid('item_id')
      .notNull()
      .references(() => items.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.itemId] })],
);

// ======================= TYPES =======================
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Item = InferSelectModel<typeof items>;
export type NewItem = InferInsertModel<typeof items>;
export type Booking = InferSelectModel<typeof bookings>;
export type NewBooking = InferInsertModel<typeof bookings>;
export type Review = InferSelectModel<typeof reviews>;
export type NewReview = InferInsertModel<typeof reviews>;
export type ChatMessage = InferSelectModel<typeof chatMessages>;
export type NewChatMessage = InferInsertModel<typeof chatMessages>;
export type Wallet = InferSelectModel<typeof wallets>;
export type WalletTransaction = InferSelectModel<typeof walletTransactions>;

// ======================= PAYMENTS =======================
export const paymentProviderEnum = pgEnum('payment_provider', [
  'stripe',
  'paystack',
  'flutterwave',
  'monnify',
]);

export const paymentTypeEnum = pgEnum('payment_type', [
  'deposit',
  'withdrawal',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'success',
  'failed',
]);

export const paymentTransactions = pgTable(
  'payment_transactions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    amountCents: bigint('amount_cents', { mode: 'number' }).notNull(),
    currency: text('currency').default('NGN').notNull(),
    provider: paymentProviderEnum('provider').notNull(),
    type: paymentTypeEnum('type').notNull(),
    status: paymentStatusEnum('status').default('pending').notNull(),
    reference: text('reference').unique(), // Provider's reference
    externalId: text('external_id'), // Provider's internal ID if different
    metadata: text('metadata').default('{}'), // JSON stringified
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [
    index('idx_payment_tx_user').on(t.userId),
    index('idx_payment_tx_ref').on(t.reference),
    index('idx_payment_tx_status').on(t.status),
  ],
);

export type PaymentTransaction = InferSelectModel<typeof paymentTransactions>;
export type NewPaymentTransaction = InferInsertModel<
  typeof paymentTransactions
>;
