import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { sql } from 'drizzle-orm';
import { db } from '../config/db/drizzle/client';
import {
    bookings,
    chatMessages,
    itemCategoryEnum,
    items,
    reviews,
    users,
    wallets,
    walletTransactions,
    type Item,
    type User,
} from '../config/db/schema';

// Target location: 7.9001865, 4.6571689
const TARGET_LAT = 7.9001865;
const TARGET_LNG = 4.6571689;

function getRandomLocationNear(
  lat: number,
  lng: number,
  radiusInKm: number = 3,
): [number, number] {
  const r = radiusInKm / 111.32; // Convert km to degrees (approx)
  const u = Math.random();
  const v = Math.random();
  const w = r * Math.sqrt(u);
  const t = 2 * Math.PI * v;
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);

  const newLat = lat + y;
  const newLng = lng + x / Math.cos(lat * (Math.PI / 180));

  return [newLat, newLng];
}

const CATEGORY_IMAGES: Record<string, string[]> = {
  electronics: [
    'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80',
  ],
  tools: [
    'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
  ],
  clothing: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  ],
  books: [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80',
  ],
  sports_outdoors: [
    'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
  ],
  home_garden: [
    'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
  ],
  toys_games: [
    'https://images.unsplash.com/photo-1566576912902-199bd620ed15?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
  ],
  automotive: [
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80',
  ],
  baby_kids: [
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
  ],
  health_beauty: [
    'https://images.unsplash.com/photo-1571781926291-28b46c54908d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=800&q=80',
  ],
  musical_instruments: [
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80',
  ],
  office_supplies: [
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=800&q=80',
  ],
  pet_supplies: [
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
  ],
  art_collectibles: [
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=800&q=80',
  ],
  others: [
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
  ],
};

function getRandomImageForCategory(category: string): string {
  const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['others'];
  return faker.helpers.arrayElement(images);
}

const SEED_USERS = [
  {
    email: 'koredey4u@gmail.com',
    name: 'Yusuf Yusuf',
    bio: 'Living life, love to lend! Tech enthusiast and community helper.',
    phone: '+23412345678',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    email: 'alice@example.com',
    name: 'Alice Johnson',
    bio: 'Avid reader and gardener. Always happy to share tools and books.',
    phone: '+23412345679',
    avatarUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
  },
  {
    email: 'bob@example.com',
    name: 'Bob Smith',
    bio: 'DIY expert. If you need a tool, I probably have it.',
    phone: '+23412345680',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    email: 'charlie@example.com',
    name: 'Charlie Brown',
    bio: 'Photography and gadgets. Rent my gear for your next shoot!',
    phone: '+23412345681',
    avatarUrl:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&q=80',
  },
  {
    email: 'diana@example.com',
    name: 'Diana Prince',
    bio: 'Fashion lover. Refreshing my wardrobe often, so renting out the rest.',
    phone: '+23412345682',
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
];

const SEED_ITEMS = [
  // Yusuf's Items (Index 0)
  {
    ownerIndex: 0,
    title: 'Canon EOS R5 Camera',
    description:
      'Professional grade mirrorless camera. Perfect for photo shoots and video projects. Comes with a 24-70mm lens.',
    category: 'electronics',
    photos: [
      'https://images.unsplash.com/photo-1624138784181-dc7f5b75e52e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    ],
    dailyRentalPriceCents: 500000, // ₦5,000
    suggestedTip: 'Please handle with care!',
  },
  {
    ownerIndex: 0,
    title: 'MacBook Pro M1 16"',
    description:
      'High performance laptop for editing and coding. M1 Max chip, 32GB RAM.',
    category: 'electronics',
    photos: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
    ],
    dailyRentalPriceCents: 300000, // ₦3,000
  },
  {
    ownerIndex: 0,
    title: 'Cordless Power Drill Set',
    description:
      'DeWalt cordless drill with two batteries and a set of drill bits. Great for home projects.',
    category: 'tools',
    photos: [
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80',
    ],
    dailyRentalPriceCents: 100000, // ₦1,000
  },

  // Alice's Items (Index 1)
  {
    ownerIndex: 1,
    title: 'Harry Potter Box Set',
    description:
      'Complete set of Harry Potter books. Hardcover edition. Great condition.',
    category: 'books',
    photos: [
      'https://images.unsplash.com/photo-1618666012174-83b441c0bc76?auto=format&fit=crop&w=800&q=80',
    ],
    dailyRentalPriceCents: 50000, // ₦500
    isPermanentGive: true,
  },
  {
    ownerIndex: 1,
    title: 'Gardening Tool Kit',
    description:
      'Includes shovel, rake, pruning shears, and gloves. Everything you need for your garden.',
    category: 'home_garden',
    photos: [
      'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=800&q=80',
    ],
    dailyRentalPriceCents: 80000, // ₦800
  },
  {
    ownerIndex: 1,
    title: '2-Person Camping Tent',
    description:
      'Lightweight and easy to set up. Perfect for a weekend getaway.',
    category: 'sports_outdoors',
    photos: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
    ],
    dailyRentalPriceCents: 150000, // ₦1,500
  },

  // Bob's Items (Index 2)
  {
    ownerIndex: 2,
    title: 'Heavy Duty Ladder',
    description: 'Extension ladder, reaches up to 20 feet. Sturdy and safe.',
    category: 'tools',
    photos: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    ],
    dailyRentalPriceCents: 120000, // ₦1,200
  },
  {
    ownerIndex: 2,
    title: 'Circular Saw',
    description:
      'Electric circular saw for cutting wood. Safety goggles included.',
    category: 'tools',
    photos: [
      'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=800&q=80',
    ],
    dailyRentalPriceCents: 150000, // ₦1,500
  },

  // Charlie's Items (Index 3)
  {
    ownerIndex: 3,
    title: 'GoPro Hero 9',
    description:
      'Action camera for capturing your adventures. Waterproof and 4K video.',
    category: 'electronics',
    photos: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
    ],
    dailyRentalPriceCents: 200000, // ₦2,000
  },
  {
    ownerIndex: 3,
    title: 'DJI Mini 2 Drone',
    description:
      'Compact drone with 4K camera. Easy to fly and great for aerial shots.',
    category: 'electronics',
    photos: [
      'https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=800&q=80',
    ],
    dailyRentalPriceCents: 350000, // ₦3,500
  },

  // Diana's Items (Index 4)
  {
    ownerIndex: 4,
    title: 'Designer Handbag',
    description:
      'Luxury handbag for special occasions. Authentic and in pristine condition.',
    category: 'clothing',
    photos: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    ],
    dailyRentalPriceCents: 400000, // ₦4,000
  },
  {
    ownerIndex: 4,
    title: 'Yoga Mat & Blocks',
    description:
      'High quality yoga mat with two foam blocks. Clean and sanitized.',
    category: 'sports_outdoors',
    photos: [
      'https://images.unsplash.com/photo-1592432678016-e910b452f9a9?auto=format&fit=crop&w=800&q=80',
    ],
    dailyRentalPriceCents: 50000, // ₦500
  },
];

async function clearDatabase() {
  console.log('🧹 Clearing database...');
  await db.execute(sql`
    TRUNCATE TABLE 
      users, 
      items, 
      wallets, 
      bookings, 
      wallet_transactions, 
      reviews, 
      chat_messages,
      payment_transactions,
      user_locations,
      saved_items,
      reports,
      device_tokens
    CASCADE;
  `);
  console.log('✅ Database cleared.');
}

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    await clearDatabase();

    // 1. Create Users
    console.log('Creating users...');
    const passwordHash = await bcrypt.hash('Yusuf-2706', 10);
    const defaultPasswordHash = await bcrypt.hash('password123', 10);

    const createdUsers: User[] = [];

    for (const userData of SEED_USERS) {
      const [user] = await db
        .insert(users)
        .values({
          email: userData.email,
          passwordHash:
            userData.email === 'koredey4u@gmail.com'
              ? passwordHash
              : defaultPasswordHash,
          name: userData.name,
          avatarUrl: userData.avatarUrl,
          bio: userData.bio,
          phone: userData.phone,
          phoneVerified: true,
          trustScore: 100,
          isActive: true,
        })
        .returning();
      createdUsers.push(user);
    }
    // Generate random users
    const TOTAL_USERS = 16;
    const usersNeeded = TOTAL_USERS - createdUsers.length;

    console.log(`Creating ${usersNeeded} random users...`);
    for (let i = 0; i < usersNeeded; i++) {
      const [user] = await db
        .insert(users)
        .values({
          email: faker.internet.email(),
          passwordHash: defaultPasswordHash,
          name: faker.person.fullName(),
          avatarUrl: faker.image.avatar(),
          bio: faker.person.bio(),
          phone: `+234${faker.string.numeric(10)}`,
          phoneVerified: true,
          trustScore: faker.number.int({ min: 80, max: 100 }) as any,
          isActive: true,
        })
        .returning();
      createdUsers.push(user);
    }

    console.log(`✅ Created specific user: Yusuf Yusuf`);
    console.log(`✅ Created ${createdUsers.length} total users.`);

    // 2. Create Wallets
    console.log('Creating wallets...');
    for (const user of createdUsers) {
      await db.insert(wallets).values({
        userId: user.id,
        availableBalanceCents: 5000000, // ₦50,000
        frozenBalanceCents: 0,
      });

      await db.insert(walletTransactions).values({
        walletId: user.id,
        amountCents: 5000000,
        type: 'deposit',
        description: 'Initial deposit',
      });
    }
    console.log('✅ Created wallets for all users.');

    // 3. Create Items
    console.log('Creating items...');
    const createdItems: Item[] = [];

    for (const itemData of SEED_ITEMS) {
      const owner = createdUsers[itemData.ownerIndex];
      const [lat, lng] = getRandomLocationNear(TARGET_LAT, TARGET_LNG);

      const [item] = await db
        .insert(items)
        .values({
          ownerId: owner.id,
          title: itemData.title,
          description: itemData.description,
          category: itemData.category as any,
          photos: itemData.photos,
          isPermanentGive: itemData.isPermanentGive || false,
          isAvailable: true,
          dailyRentalPriceCents: itemData.dailyRentalPriceCents,
          location: [lat, lng],
          locationText: 'Near University of Ibadan',
          suggestedTip: itemData.suggestedTip,
        })
        .returning();
      createdItems.push(item);
    }
    // Generate random items
    const TOTAL_ITEMS = 50;
    const itemsNeeded = TOTAL_ITEMS - createdItems.length;
    const categories = itemCategoryEnum.enumValues;

    console.log(`Creating ${itemsNeeded} random items...`);
    for (let i = 0; i < itemsNeeded; i++) {
      const owner = faker.helpers.arrayElement(createdUsers);
      const [lat, lng] = getRandomLocationNear(TARGET_LAT, TARGET_LNG);
      const category = faker.helpers.arrayElement(categories);

      const [item] = await db
        .insert(items)
        .values({
          ownerId: owner.id,
          title: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          category: category as any,
          photos: [getRandomImageForCategory(category as string)],
          isPermanentGive: faker.datatype.boolean(0.1), // 10% chance
          isAvailable: true,
          dailyRentalPriceCents: faker.number.int({
            min: 100000,
            max: 1000000,
          }), // 1k - 10k
          location: [lat, lng],
          locationText: faker.location.streetAddress(),
          suggestedTip: faker.datatype.boolean() ? 'Thanks!' : null,
        })
        .returning();
      createdItems.push(item);
    }
    console.log(`✅ Created ${createdItems.length} items.`);

    // 4. Create Bookings & Interactions
    console.log('Creating bookings...');
    const createdBookings: any[] = [];

    // Scenario 1: Alice rents Yusuf's Camera (Completed)
    const yusuf = createdUsers[0];
    const alice = createdUsers[1];
    const camera = createdItems.find((i) => i.title === 'Canon EOS R5 Camera');

    if (camera) {
      const rentalFee = camera.dailyRentalPriceCents * 3; // 3 days
      const [booking] = await db
        .insert(bookings)
        .values({
          itemId: camera.id,
          borrowerId: alice.id,
          status: 'completed',
          requestedFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          requestedTo: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
          rentalFeeCents: rentalFee,
          totalChargedCents: rentalFee,
        })
        .returning();

      // Transactions
      await db.insert(walletTransactions).values([
        {
          walletId: alice.id,
          amountCents: -rentalFee,
          type: 'rental_payment',
          bookingId: booking.id,
          description: `Rental payment for ${camera.title}`,
        },
        {
          walletId: yusuf.id,
          amountCents: rentalFee,
          type: 'rental_receive',
          bookingId: booking.id,
          description: `Rental income for ${camera.title}`,
        },
      ]);

      // Review
      await db.insert(reviews).values({
        bookingId: booking.id,
        reviewerId: alice.id,
        rating: 5,
        comment:
          'Great camera! Yusuf was very helpful and flexible with pickup.',
      });

      // Chat
      await db.insert(chatMessages).values([
        {
          bookingId: booking.id,
          senderId: alice.id,
          message: 'Hi Yusuf, is the camera available for this weekend?',
          isRead: true,
          createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        },
        {
          bookingId: booking.id,
          senderId: yusuf.id,
          message: 'Yes it is! You can pick it up on Friday.',
          isRead: true,
          createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 + 3600000),
        },
      ]);
    }

    // Scenario 2: Yusuf rents Charlie's Drone (Completed)
    const charlie = createdUsers[3];
    const drone = createdItems.find((i) => i.title === 'DJI Mini 2 Drone');

    if (drone) {
      const rentalFee = drone.dailyRentalPriceCents * 2; // 2 days
      const [booking] = await db
        .insert(bookings)
        .values({
          itemId: drone.id,
          borrowerId: yusuf.id,
          status: 'completed',
          requestedFrom: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          requestedTo: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
          rentalFeeCents: rentalFee,
          totalChargedCents: rentalFee,
        })
        .returning();

      // Transactions
      await db.insert(walletTransactions).values([
        {
          walletId: yusuf.id,
          amountCents: -rentalFee,
          type: 'rental_payment',
          bookingId: booking.id,
          description: `Rental payment for ${drone.title}`,
        },
        {
          walletId: charlie.id,
          amountCents: rentalFee,
          type: 'rental_receive',
          bookingId: booking.id,
          description: `Rental income for ${drone.title}`,
        },
      ]);

      // Review
      await db.insert(reviews).values({
        bookingId: booking.id,
        reviewerId: yusuf.id,
        // revieweeId: charlie.id, // Removed
        rating: 5,
        comment: 'Amazing drone, captured stunning footage. Thanks Charlie!',
      });
    }

    // Scenario 3: Bob rents Yusuf's Drill (Pending/Accepted)
    const bob = createdUsers[2];
    const drill = createdItems.find(
      (i) => i.title === 'Cordless Power Drill Set',
    );

    if (drill) {
      const rentalFee = drill.dailyRentalPriceCents * 1;
      const [booking] = await db
        .insert(bookings)
        .values({
          itemId: drill.id,
          borrowerId: bob.id,
          status: 'accepted',
          requestedFrom: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
          requestedTo: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          rentalFeeCents: rentalFee,
          totalChargedCents: 0,
        })
        .returning();

      await db.insert(chatMessages).values([
        {
          bookingId: booking.id,
          senderId: bob.id,
          message:
            'Hey Yusuf, need this for a quick fix at home. Available tomorrow?',
          isRead: true,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          bookingId: booking.id,
          senderId: yusuf.id,
          message: "Hi Bob, sure thing! It's fully charged and ready to go.",
          isRead: false,
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        },
      ]);

      // Hold funds for Bob
      await db.insert(walletTransactions).values({
        walletId: bob.id,
        amountCents: -rentalFee,
        type: 'hold',
        bookingId: booking.id,
        description: `Funds held for ${drill.title}`,
      });
    }

    // Scenario 4: Diana rents Alice's Gardening Kit (Pending)
    const diana = createdUsers[4];
    const gardeningKit = createdItems.find(
      (i) => i.title === 'Gardening Tool Kit',
    );

    if (gardeningKit) {
      const rentalFee = gardeningKit.dailyRentalPriceCents * 2; // 2 days
      const [booking] = await db
        .insert(bookings)
        .values({
          itemId: gardeningKit.id,
          borrowerId: diana.id,
          status: 'pending',
          requestedFrom: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Next week
          requestedTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          rentalFeeCents: rentalFee,
          totalChargedCents: 0,
        })
        .returning();

      await db.insert(chatMessages).values([
        {
          bookingId: booking.id,
          senderId: diana.id,
          message:
            'Hi Alice, planning a garden revamp this weekend. Is the kit available?',
          isRead: true,
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        },
        {
          bookingId: booking.id,
          senderId: alice.id,
          message: 'Hello Diana! Yes, it is. Happy to help a fellow gardener.',
          isRead: true,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        },
        {
          bookingId: booking.id,
          senderId: diana.id,
          message: "Wonderful! I've sent the request.",
          isRead: false,
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        },
      ]);

      // Hold funds for Diana
      await db.insert(walletTransactions).values({
        walletId: diana.id,
        amountCents: -rentalFee,
        type: 'hold',
        bookingId: booking.id,
        description: `Funds held for ${gardeningKit.title}`,
      });
    }

    // Scenario 5: Charlie rejects Alice's request (Rejected)
    const charlie2 = createdUsers[3];
    const alice2 = createdUsers[1];
    const gopro = createdItems.find((i) => i.title === 'GoPro Hero 9');

    if (gopro) {
      const rentalFee = gopro.dailyRentalPriceCents * 2;
      const [booking] = await db
        .insert(bookings)
        .values({
          itemId: gopro.id,
          borrowerId: alice2.id,
          status: 'rejected',
          requestedFrom: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          requestedTo: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          rentalFeeCents: rentalFee,
          totalChargedCents: 0,
        })
        .returning();

      await db.insert(chatMessages).values([
        {
          bookingId: booking.id,
          senderId: alice2.id,
          message: 'Hi Charlie, can I rent the GoPro for my trip?',
          isRead: true,
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        },
        {
          bookingId: booking.id,
          senderId: charlie2.id,
          message: 'Sorry Alice, I need it myself for those dates.',
          isRead: true,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
      ]);
    }

    // Generate random bookings
    const TOTAL_BOOKINGS = 60;
    const bookingsNeeded = TOTAL_BOOKINGS - createdBookings.length;

    console.log(`Creating ${bookingsNeeded} random bookings...`);
    for (let i = 0; i < bookingsNeeded; i++) {
      const item = faker.helpers.arrayElement(createdItems);
      const borrower = faker.helpers.arrayElement(
        createdUsers.filter((u) => u.id !== item.ownerId),
      );
      const status = faker.helpers.arrayElement([
        'completed',
        'accepted',
        'pending',
        'cancelled',
        'rejected',
      ]);
      const days = faker.number.int({ min: 1, max: 7 });
      const rentalFee = item.dailyRentalPriceCents * days;

      const requestedFrom = faker.date.recent({ days: 30 });
      const requestedTo = new Date(
        requestedFrom.getTime() + days * 24 * 60 * 60 * 1000,
      );

      const [booking] = await db
        .insert(bookings)
        .values({
          itemId: item.id,
          borrowerId: borrower.id,
          status: status as any,
          requestedFrom,
          requestedTo,
          rentalFeeCents: rentalFee,
          totalChargedCents: status === 'completed' ? rentalFee : 0,
        })
        .returning();
      createdBookings.push(booking);

      // Add transactions for completed bookings
      if (status === 'completed') {
        await db.insert(walletTransactions).values([
          {
            walletId: borrower.id,
            amountCents: -rentalFee,
            type: 'rental_payment',
            bookingId: booking.id,
            description: `Rental payment for ${item.title}`,
          },
          {
            walletId: item.ownerId,
            amountCents: rentalFee,
            type: 'rental_receive',
            bookingId: booking.id,
            description: `Rental income for ${item.title}`,
          },
        ]);
      }
    }
    console.log(`✅ Created ${createdBookings.length} bookings.`);

    // Create reviews for completed bookings
    console.log('Creating reviews...');
    for (const booking of createdBookings) {
      if (booking.status === 'completed') {
        // 70% chance of review
        if (faker.datatype.boolean(0.7)) {
          // Get item to find owner
          const item = createdItems.find((i) => i.id === booking.itemId);
          if (!item) continue;

          await db.insert(reviews).values({
            bookingId: booking.id,
            reviewerId: booking.borrowerId,
            rating: 5,
            comment: 'Great item, thanks!',
          });
        }
      }
    }
    console.log('✅ Created reviews for completed bookings.');

    // Create messages
    console.log('Creating messages...');
    for (const booking of createdBookings) {
      // 50% chance of messages if not one of the specific scenarios (which already have messages)
      // We can check if messages exist, but easier to just add random ones for random bookings
      // The specific scenarios were added before, so we can just add to others or add more.
      // Let's just add to random bookings that don't have messages yet (simplified by probability)

      if (faker.datatype.boolean(0.5)) {
        const item = createdItems.find((i) => i.id === booking.itemId);
        if (!item) continue;

        await db.insert(chatMessages).values({
          bookingId: booking.id,
          senderId: booking.borrowerId,
          message: faker.lorem.sentence(),
          isRead: faker.datatype.boolean(),
          createdAt: booking.createdAt,
        });
      }
    }
    console.log('✅ Created chat messages.');

    console.log('🌱 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
