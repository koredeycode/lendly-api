import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor() {}
  @ApiResponse({
    status: 200,
    description: 'User endpoint',
  })
  @Get('/hello')
  hello() {
    return { message: 'Hello from user endpoint' };
  }
}
