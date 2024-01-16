import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('check')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('/health')
  async checkHealth() {
    return this.healthService.checkHealth();
  }

  @Get('/db')
  async checkDb() {
    return await this.healthService.checkDb();
  }

  @Get('/uuid')
  async checkUuid() {
    const uuid = await this.healthService.checkUuid();
    return {
      code: 200,
      message: 'Here is uuid',
      uuid,
    };
  }
}
