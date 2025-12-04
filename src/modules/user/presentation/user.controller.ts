import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SuccessResponseDTO } from 'src/common/dto/success-response.dto';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { JwtAuthGuard } from 'src/modules/auth/presentation/jwt-auth.guard';
import { BookingService } from 'src/modules/booking/application/booking.service';
import { BookingResponseDTO } from 'src/modules/booking/application/dto/booking-response.dto';
import { CreateSavedItemDTO } from 'src/modules/item/application/dto/create-saved-item.dto';
import { ItemsResponseDTO } from 'src/modules/item/application/dto/item-response.dto';
import { ItemService } from 'src/modules/item/application/item.service';
import { WalletResponseDTO } from 'src/modules/wallet/application/dto/wallet-response.dto';
import { WalletService } from 'src/modules/wallet/application/wallet.service';
import { PublicUserResponseDTO } from '../application/dto/public-user-response.dto';
import { UpdateUserDTO } from '../application/dto/update-user.dto';
import { UserResponseDTO } from '../application/dto/user-response.dto';
import { UserService } from '../application/user.service';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly walletService: WalletService,
    private readonly bookingService: BookingService,
    private readonly itemService: ItemService,
  ) {}
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User endpoint',
    type: UserResponseDTO,
  })
  @Get('/me')
  async getCurrentUser(@Request() req: AuthenticatedRequest) {
    // const data = await this.profileUseCase.execute(req.user.id);
    const data = await this.userService.findUserByEmail(req.user.email);
    console.log({ data });

    return { message: 'User retrieved successfully', data };
  }

  @ApiOperation({ summary: 'Get user wallet' })
  @ApiResponse({
    status: 200,
    description: 'User Wallet',
    type: WalletResponseDTO,
  })
  @Get('/wallet')
  async getUserWallet(@Request() req: AuthenticatedRequest) {
    const data = await this.walletService.getWallet(req.user.id);
    return { message: 'User wallet retrieved successfully', data };
  }

  @ApiOperation({ summary: 'Get user bookings' })
  @ApiResponse({
    status: 200,
    description: 'User bookings retrieved successfully',
    type: [BookingResponseDTO],
  })
  @Get('/bookings')
  async getUserBookings(@Request() req: AuthenticatedRequest) {
    const data = await this.bookingService.getUserBookings(req.user.id);
    return { message: 'User bookings retrieved successfully', data };
  }

  @ApiOperation({ summary: 'Get user saved items' })
  @ApiResponse({
    status: 200,
    description: 'Get user saved items',
    type: SuccessResponseDTO,
  })
  @Get('/saved-items')
  async getUserSavedItems(@Request() req: AuthenticatedRequest) {
    const data = await this.itemService.getSavedItems(req.user.id);
    return { message: 'User saved items retrieved successfully', data };
  }

  @ApiOperation({ summary: 'Save an item' })
  @ApiResponse({
    status: 200,
    description: 'Get user saved items',
    type: SuccessResponseDTO,
  })
  @Post('/saved-items')
  async createUserSavedItem(
    @Request() req: AuthenticatedRequest,
    @Body() body: CreateSavedItemDTO,
  ) {
    await this.itemService.saveItem(req.user.id, body.itemId);
    return { message: 'User saved item created successfully' };
  }

  @ApiOperation({ summary: 'Remove a saved item' })
  @ApiResponse({
    status: 200,
    description: 'Delete user saved item',
    type: SuccessResponseDTO,
  })
  @Delete('/saved-items')
  async deleteUserSavedItem(
    @Request() req: AuthenticatedRequest,
    @Body() body: CreateSavedItemDTO,
  ) {
    await this.itemService.unsaveItem(req.user.id, body.itemId);
    return { message: 'User saved item deleted successfully' };
  }

  @ApiOperation({ summary: 'Get user details by ID' })
  @ApiResponse({
    status: 200,
    description: 'User details',
    type: PublicUserResponseDTO,
  })
  @Get('/:id')
  async getUserDetails(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    const user = await this.userService.findUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const data = {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      trustScore: user.trustScore,
      createdAt: user.createdAt,
    };

    return { message: 'User details retrieved successfully', data };
  }

  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated',
    type: UserResponseDTO,
  })
  @Patch()
  async updateUser(
    @Request() req: AuthenticatedRequest,
    @Body() body: UpdateUserDTO,
  ) {
    const data = await this.userService.updateUser(req.user.id, body);
    return { message: 'User updated successfully', data };
  }

  @ApiOperation({ summary: 'Get user items' })
  @ApiResponse({
    status: 200,
    description: 'Get user items',
    type: ItemsResponseDTO,
  })
  @Get('/:id/items')
  async getUserItems(
    @Request() req: AuthenticatedRequest,
    @Param('id') id: string,
  ) {
    const data = await this.itemService.getUserItems(id);
    return { message: 'User items retrieved successfully', data };
  }
}
