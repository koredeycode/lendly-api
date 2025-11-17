import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './drizzle/client';

async function runMigrations() {
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: 'src/config/drizzle' });
  console.log('Migrations complete');
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error(err);
  process.exit(1);
});
