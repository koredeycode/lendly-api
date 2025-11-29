import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/presentation/jwt-auth.guard';
import { BookingService } from 'src/modules/booking/application/booking.service';
import { CreateBookingUseCase } from 'src/modules/booking/application/create-booking.usecase';
import { CreateBookingDTO } from 'src/modules/booking/application/dto/create-booking.dto';
import { CreateItemUseCase } from '../application/create-item.usecase';
import { DeleteItemUseCase } from '../application/delete-item.usecase';
import { CreateItemDTO } from '../application/dto/create-item.dto';
import { SearchItemsDTO } from '../application/dto/search-items.dto';
import { UpdateItemDTO } from '../application/dto/update-item.dto';
import { ItemService } from '../application/item.service';
import { UpdateItemUseCase } from '../application/update-item.usecase';

@ApiTags('Item')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('items')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly createItemUseCase: CreateItemUseCase,
    private readonly updateItemUseCase: UpdateItemUseCase,
    private readonly deleteItemUseCase: DeleteItemUseCase,
    private readonly createBookingUseCase: CreateBookingUseCase,
    private readonly bookingService: BookingService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'The item has beeen successfully retrieved',
  })
  @Get(':id')
  async getItem(@Param('id') id: string) {
    const data = await this.itemService.findItem(id);
    return { message: 'Item successfuly retrieved', data };
  }

  @ApiResponse({
    status: 201,
    description: 'The item has beeen successfully created',
  })
  @Post()
  async createItem(@Request() req, @Body() body: CreateItemDTO) {
    //should use req.user.id

    const data = await this.createItemUseCase.execute(req.user.id, body);
    return { message: 'Item created successfully', data };
  }

  @ApiResponse({
    status: 200,
    description: 'The item has beeen successfully updated',
  })
  @Patch(':id')
  async updateItem(@Param('id') id: string, @Body() body: UpdateItemDTO) {
    const data = await this.updateItemUseCase.execute('', body);
    return { message: 'Item updated successfully', data };
  }

  @ApiResponse({
    status: 200,
    description: 'The item has beeen successfully deleted',
  })
  @Delete(':id')
  async deleteItem(@Param('id') id: string) {
    await this.deleteItemUseCase.execute(id);
    return { message: 'Item deleted successfully' };
  }

  // @ApiResponse({
  //   status: 201,
  //   description: 'Fetch bookings for an item',
  // })
  // @Get(':id/bookings')
  // async getItemBookings(@Param('id') id: string) {
  //   return { message: 'Bookings for an item retrieved successfully' };
  // }

  @ApiResponse({
    status: 201,
    description: 'A booking request has been successfully created',
  })
  @Post(':id/bookings/request')
  async requestBooking(
    @Request() req,
    @Param('id') id: string,
    @Body() body: CreateBookingDTO,
  ) {
    const data = await this.createBookingUseCase.execute(id, req.user.id, body);
    return { message: 'Booking request submitted successfully', data };
  }

  @ApiResponse({
    status: 200,
    description: 'A booking request has been successfully created',
  })
  @Post('search')
  async searchItems(@Request() req, @Body() body: SearchItemsDTO) {
    // use req.user.id
    const data = await this.itemService.searchItems(body);
    return { message: 'Search query run successfully', data };
  }
  @ApiResponse({
    status: 200,
    description: 'Fetch bookings for an item',
  })
  @Get(':id/bookings')
  async getItemBookings(@Request() req, @Param('id') id: string) {
    const item = await this.itemService.findItem(id);
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (item.ownerId !== req.user.id) {
      throw new ForbiddenException('You are not the owner of this item');
    }

    const data = await this.bookingService.findBookingsByItem(id);
    return { message: 'Bookings retrieved successfully', data };
  }

  @ApiResponse({
    status: 200,
    description: 'Check item availability',
  })
  @Get(':id/availability')
  async checkAvailability(
    @Param('id') id: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const isAvailable = await this.bookingService.checkAvailability(
      id,
      new Date(from),
      new Date(to),
    );
    return {
      message: 'Availability checked successfully',
      data: { isAvailable },
    };
  }
}
