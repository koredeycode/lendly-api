import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IdempotencyGuard } from './idempotency.guard';

describe('IdempotencyGuard', () => {
  let guard: IdempotencyGuard;
  let redisMock: any;

  beforeEach(async () => {
    redisMock = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IdempotencyGuard,
        {
          provide: 'REDIS_CLIENT',
          useValue: redisMock,
        },
      ],
    }).compile();

    guard = module.get<IdempotencyGuard>(IdempotencyGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw BadRequestException if no idempotency key', async () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
        getResponse: () => ({}),
      }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).rejects.toThrow(
      'Idempotency-Key header is required',
    );
  });

  it('should return cached response if key exists', async () => {
    const cachedResponse = JSON.stringify({ status: 201, body: { success: true } });
    redisMock.get.mockResolvedValue(cachedResponse);

    const responseMock = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { 'idempotency-key': 'test-key' },
          user: { id: 'user-1' },
        }),
        getResponse: () => responseMock,
      }),
    } as ExecutionContext;

    expect(await guard.canActivate(context)).toBe(false);
    expect(redisMock.get).toHaveBeenCalledWith('idempotency:user-1:test-key');
    expect(responseMock.status).toHaveBeenCalledWith(201);
    expect(responseMock.json).toHaveBeenCalledWith({ success: true });
  });

  it('should proceed and cache response if key does not exist', async () => {
    redisMock.get.mockResolvedValue(null);

    const originalSend = jest.fn();
    const responseMock = {
      statusCode: 200,
      send: originalSend,
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { 'idempotency-key': 'test-key' },
          user: { id: 'user-1' },
        }),
        getResponse: () => responseMock,
      }),
    } as ExecutionContext;

    expect(await guard.canActivate(context)).toBe(true);
    expect(redisMock.get).toHaveBeenCalledWith('idempotency:user-1:test-key');

    // Simulate response sending
    responseMock.send({ success: true });

    expect(redisMock.set).toHaveBeenCalledWith(
      'idempotency:user-1:test-key',
      JSON.stringify({ status: 200, body: { success: true } }),
      'EX',
      86400,
    );
    expect(originalSend).toHaveBeenCalledWith({ success: true });
  });
});
