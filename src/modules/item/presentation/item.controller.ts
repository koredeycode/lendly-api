import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ItemService } from '../application/item.service';

@ApiTags('Item')
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @ApiResponse({
    status: 200,
    description: 'Item endpoint',
  })
  @Get('/hello')
  hello() {
    return { message: 'Hello from item endpoint' };
  }
}
