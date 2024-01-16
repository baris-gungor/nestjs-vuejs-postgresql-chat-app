import { Injectable, Inject, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Health } from '../../domain';
import { retry } from 'rxjs';
import { CronService } from '../cron/cron.service';

@Injectable()
export class HealthService {
  constructor(
    @Inject('HEALTH_REPOSITORY') private healthRepository: Repository<Health>,
    private readonly cronService: CronService,
  ) {}
  private readonly logger = new Logger(HealthService.name);

  async checkHealth() {
    return {
      code: 200,
      message: 'Back-end is up and ready to go!',
    };
  }
  async checkDb() {
    const db = await this.healthRepository.findOne({
      where: {
        name: 'check-db',
      },
    });
    if (db.isPublished) {
      return {
        code: 200,
        message: 'Database and seeding system is working',
      };
    }
  }
  async checkUuid() {
    return await this.cronService.getUuid();
  }
}
