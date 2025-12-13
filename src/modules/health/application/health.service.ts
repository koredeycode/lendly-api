import { Inject, Injectable } from '@nestjs/common';
import {
    HealthCheck,
    HealthCheckService,
    MemoryHealthIndicator,
} from '@nestjs/terminus';
import { sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../../config/db/schema';
import { DRIZZLE } from '../../database/database.constants';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
  ) {}

  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      async () => {
        try {
          await this.db.execute(sql`SELECT 1`);
          return {
            database: {
              status: 'up',
            },
          };
        } catch (error) {
          return {
            database: {
              status: 'down',
              message: (error as Error).message,
            },
          };
        }
      },
    ]);
  }
}
