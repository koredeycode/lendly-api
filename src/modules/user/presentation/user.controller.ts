import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/presentation/jwt-auth.guard';
import { UpdateUserDTO } from '../application/dto/update-user.dto';
import { UserRepository } from '../domain/user.repository';

@ApiTags('User')
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

  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description: 'User endpoint',
  })
  @Get('/me')
  @ApiBearerAuth()
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
    return { message: 'Item updated successfully' };
  }
}
