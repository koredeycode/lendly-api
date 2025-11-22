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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/presentation/jwt-auth.guard';
import { UpdateUserDTO } from '../application/dto/update-user.dto';
import { UserRepository } from '../domain/user.repository';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userRepo: UserRepository) {}
  @ApiResponse({
    status: 200,
    description: 'User endpoint',
  })
  @Get('/hello')
  hello() {
    return { message: 'Hello from user endpoint' };
  }

  @ApiResponse({
    status: 200,
    description: 'User endpoint',
  })
  @Get('/me')
  async getCurrentuser(@Request() req) {
    // const data = await this.profileUseCase.execute(req.user.id);
    const data = await this.userRepo.findUserById(req.user.id);
    return { message: 'User retrieved successfully', data };
  }

  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated',
  })
  @Patch()
  async updateUser(@Body() body: UpdateUserDTO) {
    return { message: 'User updated successfully' };
  }

  @ApiResponse({
    status: 200,
    description: 'Get user items',
  })
  @Get('/:id/items')
  async getUserItems(@Request() req) {
    return { message: 'User items retrieved successfully' };
  }

  @ApiResponse({
    status: 200,
    description: 'Get user saved items',
  })
  @Get('/saved-items')
  async getUserSavedItems(@Request() req) {
    return { message: 'User saved items retrieved successfully' };
  }

  @ApiResponse({
    status: 200,
    description: 'Get user saved items',
  })
  @Post('/saved-items')
  async createUserSavedItem(@Request() req) {
    return { message: 'User saved item created successfully' };
  }

  @ApiResponse({
    status: 200,
    description: 'Delete user saved item',
  })
  @Delete('/saved-items/:id')
  async deleteUserSavedItem(@Request() req, @Param('id') id: string) {
    return { message: 'User saved item deleted successfully' };
  }
}
