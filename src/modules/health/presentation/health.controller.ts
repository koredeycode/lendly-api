import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthResponseDTO } from '../application/dto/health-response.dto';
import { HealthService } from '../application/health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @ApiResponse({
    status: 200,
    description: 'Api health check',
    type: HealthResponseDTO,
  })
  @Get()
  checkHealth() {
    return this.healthService.check();
  }
}
