import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  constructor() {}
  check() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
}
