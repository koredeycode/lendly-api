import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Request,
    UseGuards
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { JwtAuthGuard } from 'src/modules/auth/presentation/jwt-auth.guard';
import { BookingService } from 'src/modules/booking/application/booking.service';
import { CreateBookingUseCase } from 'src/modules/booking/application/create-booking.usecase';
import {
    BookingResponseDTO,
    BookingsResponseDTO,
} from 'src/modules/booking/application/dto/booking-response.dto';
import { CreateBookingDTO } from 'src/modules/booking/application/dto/create-booking.dto';
import { CreateItemUseCase } from '../application/create-item.usecase';
import { DeleteItemUseCase } from '../application/delete-item.usecase';
import { AvailabilityResponseDTO } from '../application/dto/availability-response.dto';
import { CreateItemDTO } from '../application/dto/create-item.dto';
import {
    ItemResponseDTO,
    ItemsResponseDTO,
} from '../application/dto/item-response.dto';
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

  @ApiOperation({ summary: 'Get item details' })
  @ApiResponse({
    status: 200,
    description: 'The item has beeen successfully retrieved',
    type: ItemResponseDTO,
  })
  @Get(':id')
  async getItem(@Param('id') id: string) {
    const data = await this.itemService.findItem(id);
    return { message: 'Item retrieved successfully', data };
  }

  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({
    status: 201,
    description: 'The item has beeen successfully created',
    type: ItemResponseDTO,
  })
  @Post()
  async createItem(
    @Request() req: AuthenticatedRequest,
    @Body() body: CreateItemDTO,
  ) {
    const data = await this.createItemUseCase.execute(req.user.id, body);
    return { message: 'Item created successfully', data };
  }

  @ApiOperation({ summary: 'Update an item' })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully updated',
    type: ItemResponseDTO,
  })
  @Put(':id')
  async updateItem(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: UpdateItemDTO,
  ) {
    await this.updateItemUseCase.execute(req.user.id, id, body);
    return { message: 'Item updated successfully' };
  }

  @ApiOperation({ summary: 'Delete an item' })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully deleted',
  })
  @Delete(':id')
  async deleteItem(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    await this.deleteItemUseCase.execute(req.user.id, id);
    return { message: 'Item deleted successfully' };
  }

  @ApiOperation({ summary: 'Request a booking for an item' })
  @ApiResponse({
    status: 201,
    description: 'A booking request has been successfully created',
    type: BookingResponseDTO,
  })
  @Post(':id/bookings/request')
  async requestBooking(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: CreateBookingDTO,
  ) {
    const data = await this.createBookingUseCase.execute(id, req.user.id, body);
    return { message: 'Booking request submitted successfully', data };
  }

  @ApiOperation({ summary: 'Search for items' })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved',
    type: ItemsResponseDTO,
  })
  @Post('search')
  async searchItems(
    @Request() req: AuthenticatedRequest,
    @Body() body: SearchItemsDTO,
  ) {
    const data = await this.itemService.searchItems(body);
    return { message: 'Search query run successfully', data };
  }
  @ApiOperation({ summary: 'Get bookings for an item (Owner only)' })
  @ApiResponse({
    status: 200,
    description: 'Fetch bookings for an item',
    type: BookingsResponseDTO,
  })
  @Get(':id/bookings')
  async getItemBookings(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
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

  @ApiOperation({ summary: 'Check item availability' })
  @ApiResponse({
    status: 200,
    description: 'Check item availability',
    type: AvailabilityResponseDTO,
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

  @ApiOperation({ summary: 'Toggle item availability' })
  @ApiResponse({
    status: 200,
    description: 'Item availability toggled successfully',
  })
  @Post(':id/toggle-availability')
  async toggleAvailability(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    const item = await this.itemService.toggleAvailability(id, req.user.id);
    return {
      message: 'Item availability toggled successfully',
      data: item,
    };
  }
}
