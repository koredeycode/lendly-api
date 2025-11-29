import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppResponseDTO } from './app.dto';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Hello World' })
  @ApiResponse({
    status: 200,
    description: 'Hello World',
    type: AppResponseDTO,
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
