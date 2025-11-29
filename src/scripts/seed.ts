import { faker } from '@faker-js/faker';
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
  type Booking,
  type Item,
  type User,
} from '../config/db/schema';

// Real image URLs from Unsplash
const ITEM_IMAGES = {
  electronics: [
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80', // Smart Watch
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80', // Laptop
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', // Headphones
    'https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=800&q=80', // Camera
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=800&q=80', // Monitor
  ],
  tools: [
    'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80', // Drill
    'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=800&q=80', // Hammer
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', // Wrench
    'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=800&q=80', // Saw
    'https://images.unsplash.com/photo-1566937169390-7be4c63b8a0e?auto=format&fit=crop&w=800&q=80', // Toolbox
  ],
  fashion: [
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80', // T-shirt
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', // Sneakers
    'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80', // Jacket
    'https://images.unsplash.com/photo-1551028919-ac66c5f8b6b9?auto=format&fit=crop&w=800&q=80', // Leather Jacket
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80', // Dress
  ],
  books: [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80', // Book Stack
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80', // Open Book
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80', // Library
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80', // Reading
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80', // Textbook
  ],
};

const CATEGORIES = ['Electronics', 'Tools', 'Fashion', 'Books', 'Home & Garden', 'Sports'];

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

    // 1. Seed Users
    console.log('Creating users...');
    const passwordHash = await bcrypt.hash('password123', 10);
    const createdUsers: User[] = [];
    for (let i = 0; i < 10; i++) {
      const [user] = await db
        .insert(users)
        .values({
          email: faker.internet.email({ provider: 'gmail.com' }).toLowerCase(),
          passwordHash: passwordHash,
          name: faker.person.fullName(),
          avatarUrl: faker.image.avatar(),
          bio: faker.person.bio(),
          phone: faker.phone.number().slice(0, 20),
          phoneVerified: true,
          trustScore: 100,
          isActive: true,
        })
        .returning();
      createdUsers.push(user);
    }
    console.log(`✅ Created ${createdUsers.length} users.`);

    // 2. Seed Wallets & Initial Balance
    console.log('Creating wallets...');
    for (const user of createdUsers) {
      await db.insert(wallets).values({
        userId: user.id,
        availableBalanceCents: faker.number.int({ min: 1000, max: 50000 }), // $10 - $500
        frozenBalanceCents: 0,
      });

      // Add a deposit transaction for the initial balance
      await db.insert(walletTransactions).values({
        walletId: user.id,
        amountCents: faker.number.int({ min: 1000, max: 50000 }),
        type: 'deposit',
        description: 'Initial deposit',
      });
    }
    console.log('✅ Created wallets for all users.');

    // 3. Seed Items
    console.log('Creating items...');
    const createdItems: Item[] = [];
    for (let i = 0; i < 30; i++) {
      const owner = faker.helpers.arrayElement(createdUsers);
      const category = faker.helpers.arrayElement(CATEGORIES);
      
      // Get a random image based on category mapping (simplified)
      let imageUrls: string[] = [];
      if (category === 'Electronics') imageUrls = [faker.helpers.arrayElement(ITEM_IMAGES.electronics)];
      else if (category === 'Tools') imageUrls = [faker.helpers.arrayElement(ITEM_IMAGES.tools)];
      else if (category === 'Fashion') imageUrls = [faker.helpers.arrayElement(ITEM_IMAGES.fashion)];
      else if (category === 'Books') imageUrls = [faker.helpers.arrayElement(ITEM_IMAGES.books)];
      else imageUrls = [faker.image.url()]; // Fallback

      const [item] = await db
        .insert(items)
        .values({
          ownerId: owner.id,
          title: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          category: category,
          photos: imageUrls,
          isPermanentGive: faker.datatype.boolean({ probability: 0.1 }), // 10% chance
          isAvailable: true,
          dailyRentalPriceCents: faker.number.int({ min: 500, max: 5000 }), // $5 - $50
          location: [3.3792, 6.5244], // Lagos coordinates (example)
          locationText: faker.location.streetAddress(),
        })
        .returning();
      createdItems.push(item);
    }
    console.log(`✅ Created ${createdItems.length} items.`);

    // 4. Seed Bookings
    console.log('Creating bookings...');
    const createdBookings: Booking[] = [];
    for (let i = 0; i < 40; i++) {
      const item = faker.helpers.arrayElement(createdItems);
      const borrower = faker.helpers.arrayElement(createdUsers.filter(u => u.id !== item.ownerId));
      
      if (!borrower) continue;

      const status = faker.helpers.arrayElement([
        'pending',
        'accepted',
        'picked_up',
        'returned',
        'completed',
        'cancelled',
      ]);

      const requestedFrom = faker.date.recent({ days: 30 });
      const requestedTo = new Date(requestedFrom.getTime() + faker.number.int({ min: 1, max: 7 }) * 24 * 60 * 60 * 1000);
      
      const rentalFeeCents = item.dailyRentalPriceCents * Math.ceil((requestedTo.getTime() - requestedFrom.getTime()) / (1000 * 60 * 60 * 24));

      const [booking] = await db
        .insert(bookings)
        .values({
          itemId: item.id,
          borrowerId: borrower.id,
          status: status as any,
          requestedFrom: requestedFrom,
          requestedTo: requestedTo,
          rentalFeeCents: rentalFeeCents,
          totalChargedCents: status === 'completed' || status === 'returned' ? rentalFeeCents : 0,
        })
        .returning();
      createdBookings.push(booking);

      // Create wallet transactions for completed bookings
      if (status === 'completed') {
        // Borrower payment
        await db.insert(walletTransactions).values({
          walletId: borrower.id,
          amountCents: -rentalFeeCents,
          type: 'rental_payment',
          bookingId: booking.id,
          description: `Rental payment for ${item.title}`,
        });

        // Lender receipt
        await db.insert(walletTransactions).values({
          walletId: item.ownerId,
          amountCents: rentalFeeCents,
          type: 'rental_receive',
          bookingId: booking.id,
          description: `Rental income for ${item.title}`,
        });
      }
    }
    console.log(`✅ Created ${createdBookings.length} bookings.`);

    // 5. Seed Reviews
    console.log('Creating reviews...');
    const completedBookings = createdBookings.filter(b => b.status === 'completed');
    for (const booking of completedBookings) {
      const item = createdItems.find(i => i.id === booking.itemId);
      if (!item) continue;
      
      // Borrower reviews Lender/Item
      await db.insert(reviews).values({
        bookingId: booking.id,
        reviewerId: booking.borrowerId,
        revieweeId: item.ownerId, // Reviewing the owner
        rating: faker.number.int({ min: 3, max: 5 }) as any,
        comment: faker.lorem.sentence(),
      });
    }
    console.log(`✅ Created reviews for completed bookings.`);

    // 6. Seed Messages
    console.log('Creating messages...');
    for (const booking of createdBookings) {
      const item = createdItems.find(i => i.id === booking.itemId);
      if (!item) continue;

      const messagesCount = faker.number.int({ min: 0, max: 5 });
      
      for (let i = 0; i < messagesCount; i++) {
        const senderId = faker.datatype.boolean() ? booking.borrowerId : item.ownerId;
        
        await db.insert(chatMessages).values({
          bookingId: booking.id,
          senderId: senderId,
          message: faker.lorem.sentence(),
          isRead: faker.datatype.boolean(),
        });
      }
    }
    console.log(`✅ Created chat messages.`);

    console.log('🌱 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
