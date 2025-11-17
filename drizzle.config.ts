import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

dotenv.config();
console.log({ database: process.env.DATABASE_URL });
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/config/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
