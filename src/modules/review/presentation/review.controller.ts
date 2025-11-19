import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Review')
@Controller('reviews')
export class ReviewController {
  constructor() {}
  @ApiResponse({
    status: 200,
    description: 'Review endpoint',
  })
  @Get('/hello')
  hello() {
    return { message: 'Hello from review endpoint' };
  }
}
