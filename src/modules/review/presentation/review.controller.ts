import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateReviewDTO } from '../application/dto/update-review.dto';
import { JwtAuthGuard } from 'src/modules/auth/presentation/jwt-auth.guard';

@ApiTags('Review')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewController {
  constructor() {}

  @ApiResponse({
    status: 200,
    description: 'Review endpoint',
  })
  @Get('/hello')
  hello() {
    return { message: 'Hello from review endpoint' };
  }

  @ApiResponse({
    status: 200,
    description: 'Update a review',
  })
  @Patch(':id')
  async updateReview(@Param('id') id: string, @Body() body: UpdateReviewDTO) {
    return { message: 'Review updated successfully' };
  }

  @ApiResponse({
    status: 200,
    description: 'Delete a review',
  })
  @Delete(':id')
  async deleteReview(@Param('id') id: string) {
    return { message: 'Review deleted successfully' };
  }
}
