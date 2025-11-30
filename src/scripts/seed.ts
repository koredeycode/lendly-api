import * as bcrypt from 'bcrypt';
import { sql } from 'drizzle-orm';
import { db } from '../config/db/drizzle/client';
import {
  bookings,
  chatMessages,
  items,
  reviews,
  users,
  wallets,
  walletTransactions,
  type Item,
  type User
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

const SEED_USERS = [
  {
    email: 'koredey4u@gmail.com',
    name: 'Yusuf Yusuf',
    bio: 'Living life, love to lend! Tech enthusiast and community helper.',
    phone: '+23412345678',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    email: 'alice@example.com',
    name: 'Alice Johnson',
    bio: 'Avid reader and gardener. Always happy to share tools and books.',
    phone: '+23412345679',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
  },
  {
    email: 'bob@example.com',
    name: 'Bob Smith',
    bio: 'DIY expert. If you need a tool, I probably have it.',
    phone: '+23412345680',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    email: 'charlie@example.com',
    name: 'Charlie Brown',
    bio: 'Photography and gadgets. Rent my gear for your next shoot!',
    phone: '+23412345681',
    avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&q=80',
  },
  {
    email: 'diana@example.com',
    name: 'Diana Prince',
    bio: 'Fashion lover. Refreshing my wardrobe often, so renting out the rest.',
    phone: '+23412345682',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
];

const SEED_ITEMS = [
  // Yusuf's Items (Index 0)
  {
    ownerIndex: 0,
    title: 'Canon EOS R5 Camera',
    description: 'Professional grade mirrorless camera. Perfect for photo shoots and video projects. Comes with a 24-70mm lens.',
    category: 'electronics',
    photos: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80',
    ],
    dailyRentalPriceCents: 5000, // $50
    suggestedTip: 'Please handle with care!',
  },
  {
    ownerIndex: 0,
    title: 'MacBook Pro M1 16"',
    description: 'High performance laptop for editing and coding. M1 Max chip, 32GB RAM.',
    category: 'electronics',
    photos: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80',
    ],
    dailyRentalPriceCents: 3000, // $30
  },
  {
    ownerIndex: 0,
    title: 'Cordless Power Drill Set',
    description: 'DeWalt cordless drill with two batteries and a set of drill bits. Great for home projects.',
    category: 'tools',
    photos: [
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80',
    ],
    dailyRentalPriceCents: 1000, // $10
  },

  // Alice's Items (Index 1)
  {
    ownerIndex: 1,
    title: 'Harry Potter Box Set',
    description: 'Complete set of Harry Potter books. Hardcover edition. Great condition.',
    category: 'books',
    photos: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
    ],
    dailyRentalPriceCents: 500, // $5
    isPermanentGive: true,
  },
  {
    ownerIndex: 1,
    title: 'Gardening Tool Kit',
    description: 'Includes shovel, rake, pruning shears, and gloves. Everything you need for your garden.',
    category: 'home_garden',
    photos: [
      'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&w=800&q=80',
    ],
    dailyRentalPriceCents: 800, // $8
  },
  {
    ownerIndex: 1,
    title: '2-Person Camping Tent',
    description: 'Lightweight and easy to set up. Perfect for a weekend getaway.',
    category: 'sports_outdoors',
    photos: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
    ],
    dailyRentalPriceCents: 1500, // $15
  },

  // Bob's Items (Index 2)
  {
    ownerIndex: 2,
    title: 'Heavy Duty Ladder',
    description: 'Extension ladder, reaches up to 20 feet. Sturdy and safe.',
    category: 'tools',
    photos: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', // Placeholder for ladder
    ],
    dailyRentalPriceCents: 1200, // $12
  },
  {
    ownerIndex: 2,
    title: 'Circular Saw',
    description: 'Electric circular saw for cutting wood. Safety goggles included.',
    category: 'tools',
    photos: [
      'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=800&q=80',
    ],
    dailyRentalPriceCents: 1500, // $15
  },

  // Charlie's Items (Index 3)
  {
    ownerIndex: 3,
    title: 'GoPro Hero 9',
    description: 'Action camera for capturing your adventures. Waterproof and 4K video.',
    category: 'electronics',
    photos: [
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80',
    ],
    dailyRentalPriceCents: 2000, // $20
  },
  {
    ownerIndex: 3,
    title: 'DJI Mini 2 Drone',
    description: 'Compact drone with 4K camera. Easy to fly and great for aerial shots.',
    category: 'electronics',
    photos: [
      'https://images.unsplash.com/photo-1579829366248-204fe8413f31?auto=format&fit=crop&w=800&q=80',
    ],
    dailyRentalPriceCents: 3500, // $35
  },

  // Diana's Items (Index 4)
  {
    ownerIndex: 4,
    title: 'Designer Handbag',
    description: 'Luxury handbag for special occasions. Authentic and in pristine condition.',
    category: 'clothing',
    photos: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    ],
    dailyRentalPriceCents: 4000, // $40
  },
  {
    ownerIndex: 4,
    title: 'Yoga Mat & Blocks',
    description: 'High quality yoga mat with two foam blocks. Clean and sanitized.',
    category: 'sports_outdoors',
    photos: [
      'https://images.unsplash.com/photo-1592432678016-e910b452f9a9?auto=format&fit=crop&w=800&q=80',
    ],
    dailyRentalPriceCents: 500, // $5
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
          passwordHash: userData.email === 'koredey4u@gmail.com' ? passwordHash : defaultPasswordHash,
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
    console.log(`✅ Created ${createdUsers.length} users.`);

    // 2. Create Wallets
    console.log('Creating wallets...');
    for (const user of createdUsers) {
      await db.insert(wallets).values({
        userId: user.id,
        availableBalanceCents: 50000, // $500
        frozenBalanceCents: 0,
      });

      await db.insert(walletTransactions).values({
        walletId: user.id,
        amountCents: 50000,
        type: 'deposit',
        description: 'Initial deposit',
      });
    }
    console.log('✅ Created wallets.');

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
    console.log(`✅ Created ${createdItems.length} items.`);

    // 4. Create Bookings & Interactions
    console.log('Creating bookings and interactions...');
    
    // Scenario 1: Alice rents Yusuf's Camera (Completed)
    const yusuf = createdUsers[0];
    const alice = createdUsers[1];
    const camera = createdItems.find(i => i.title === 'Canon EOS R5 Camera');

    if (camera) {
      const rentalFee = camera.dailyRentalPriceCents * 3; // 3 days
      const [booking] = await db.insert(bookings).values({
        itemId: camera.id,
        borrowerId: alice.id,
        status: 'completed',
        requestedFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        requestedTo: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        rentalFeeCents: rentalFee,
        totalChargedCents: rentalFee,
      }).returning();

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
        }
      ]);

      // Review
      await db.insert(reviews).values({
        bookingId: booking.id,
        reviewerId: alice.id,
        revieweeId: yusuf.id,
        rating: 5,
        comment: 'Great camera! Yusuf was very helpful and flexible with pickup.',
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
        }
      ]);
    }

    // Scenario 2: Yusuf rents Charlie's Drone (Completed)
    const charlie = createdUsers[3];
    const drone = createdItems.find(i => i.title === 'DJI Mini 2 Drone');

    if (drone) {
      const rentalFee = drone.dailyRentalPriceCents * 2; // 2 days
      const [booking] = await db.insert(bookings).values({
        itemId: drone.id,
        borrowerId: yusuf.id,
        status: 'completed',
        requestedFrom: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        requestedTo: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        rentalFeeCents: rentalFee,
        totalChargedCents: rentalFee,
      }).returning();

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
        }
      ]);

      // Review
      await db.insert(reviews).values({
        bookingId: booking.id,
        reviewerId: yusuf.id,
        revieweeId: charlie.id,
        rating: 5,
        comment: 'Amazing drone, captured stunning footage. Thanks Charlie!',
      });
    }

    // Scenario 3: Bob rents Yusuf's Drill (Pending/Accepted)
    const bob = createdUsers[2];
    const drill = createdItems.find(i => i.title === 'Cordless Power Drill Set');

    if (drill) {
      const rentalFee = drill.dailyRentalPriceCents * 1;
      const [booking] = await db.insert(bookings).values({
        itemId: drill.id,
        borrowerId: bob.id,
        status: 'accepted',
        requestedFrom: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        requestedTo: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        rentalFeeCents: rentalFee,
        totalChargedCents: 0,
      }).returning();

      await db.insert(chatMessages).values({
        bookingId: booking.id,
        senderId: bob.id,
        message: 'Hey Yusuf, need this for a quick fix at home. Available tomorrow?',
        isRead: false,
      });
    }

    console.log('✅ Created bookings and interactions.');
    console.log('🌱 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
