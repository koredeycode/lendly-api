import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('/api/health (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/health')
      .expect(200);

    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('info');
    expect(res.body).toHaveProperty('details');
    expect(res.body.info).toHaveProperty('database');
    expect(res.body.info.database.status).toBe('up');
    expect(res.body.info).toHaveProperty('memory_heap');
    expect(res.body.info.memory_heap.status).toBe('up');
  });
});
