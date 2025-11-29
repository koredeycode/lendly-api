import {
    Body,
    Controller,
    Delete,
    Param,
    Patch,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/presentation/jwt-auth.guard';
import { UpdateReviewDTO } from '../application/dto/update-review.dto';
import { ReviewService } from '../application/review.service';

@ApiTags('Review')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiOperation({ summary: 'Update a review' })
  @ApiResponse({
    status: 200,
    description: 'Update a review',
  })
  @Patch(':id')
  async updateReview(@Param('id') id: string, @Body() body: UpdateReviewDTO) {
    const data = await this.reviewService.updateReview(id, body);
    return { message: 'Review updated successfully', data };
  }

  @ApiOperation({ summary: 'Delete a review' })
  @ApiResponse({
    status: 200,
    description: 'Delete a review',
  })
  @Delete(':id')
  async deleteReview(@Param('id') id: string) {
    await this.reviewService.deleteReview(id);
    return { message: 'Review deleted successfully' };
  }
}
