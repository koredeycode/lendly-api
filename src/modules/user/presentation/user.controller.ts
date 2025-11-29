import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/presentation/jwt-auth.guard';
import { WalletService } from 'src/modules/wallet/application/wallet.service';
import { UpdateUserDTO } from '../application/dto/update-user.dto';
import { UserService } from '../application/user.service';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly walletService: WalletService,
  ) {}

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User endpoint',
  })
  @Get('/me')
  async getCurrentUser(@Request() req) {
    // const data = await this.profileUseCase.execute(req.user.id);
    const data = await this.userService.findUserByEmail(req.user.email);
    console.log({ data });

    return { message: 'User retrieved successfully', data };
  }

  @ApiOperation({ summary: 'Get user wallet' })
  @ApiResponse({
    status: 200,
    description: 'User Wallet',
  })
  @Get('/wallet')
  async getUserWallet(@Request() req) {
    const data = await this.walletService.getWallet(req.user.id);
    return { message: 'User wallet retrieved successfully', data };
  }

  @ApiOperation({ summary: 'Get user details by ID' })
  @ApiResponse({
    status: 200,
    description: 'User details',
  })
  @Get('/:id')
  async getUserDetails(@Request() req, @Param('id') id: string) {
    const data = await this.userService.findUserById(id);
    return { message: 'User details retrieved successfully', data };
  }

  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated',
  })
  @Patch()
  async updateUser(@Request() req, @Body() body: UpdateUserDTO) {
    const data = await this.userService.updateUser(req.user.id, body);
    return { message: 'User updated successfully', data };
  }

  @ApiOperation({ summary: 'Get user items' })
  @ApiResponse({
    status: 200,
    description: 'Get user items',
  })
  @Get('/:id/items')
  async getUserItems(@Request() req) {
    return { message: 'User items retrieved successfully' };
  }

  @ApiOperation({ summary: 'Get user saved items' })
  @ApiResponse({
    status: 200,
    description: 'Get user saved items',
  })
  @Get('/saved-items')
  async getUserSavedItems(@Request() req) {
    return { message: 'User saved items retrieved successfully' };
  }

  @ApiOperation({ summary: 'Save an item' })
  @ApiResponse({
    status: 200,
    description: 'Get user saved items',
  })
  @Post('/saved-items')
  async createUserSavedItem(@Request() req) {
    return { message: 'User saved item created successfully' };
  }

  @ApiOperation({ summary: 'Remove a saved item' })
  @ApiResponse({
    status: 200,
    description: 'Delete user saved item',
  })
  @Delete('/saved-items/:id')
  async deleteUserSavedItem(@Request() req, @Param('id') id: string) {
    return { message: 'User saved item deleted successfully' };
  }
}
