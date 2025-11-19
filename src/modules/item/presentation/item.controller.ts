import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
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

  @ApiResponse({
    status: 200,
    description: 'The item has beeen successfully retrieved',
  })
  @Get(':id')
  async getItem(@Param('id') id: string, @Body() body: any) {
    return { message: 'Item successfuly retrieved' };
  }

  @ApiResponse({
    status: 201,
    description: 'The item has beeen successfully created',
  })
  @Post()
  async createItem(@Body() body: any) {
    return { message: 'Item created successfully' };
  }

  @ApiResponse({
    status: 200,
    description: 'The item has beeen successfully updated',
  })
  @Patch(':id')
  async updateItem(@Param('id') id: string, @Body() body: any) {
    return { message: 'Item updated successfully' };
  }

  @ApiResponse({
    status: 200,
    description: 'The item has beeen successfully deleted',
  })
  @Delete(':id')
  async deleteItem(@Param('id') id: string, @Body() body: any) {
    return { message: 'Item deleted successfully' };
  }

  @ApiResponse({
    status: 201,
    description: 'A booking request has been successfully created',
  })
  @Post(':id/bookings/request')
  async requestBooking(@Param('id') id: string, @Body() body: any) {
    return { message: 'Booking request submitted successfully' };
  }
}
