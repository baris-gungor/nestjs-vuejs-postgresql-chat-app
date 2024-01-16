import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CronService } from '../modules/cron';

@Injectable()
export class ApiGuard implements CanActivate {
  private readonly logger = new Logger(ApiGuard.name);

  constructor(private readonly cronService: CronService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const tokens = Object.keys(request.headers)
        .filter(
          (key) =>
            key.toLowerCase() === 'authorization' ||
            key.toLowerCase() === 'auth',
        )
        .map((key) => request.headers[key]);
      const apiToken = await this.cronService.getAccessToken();
      if (tokens[0] !== apiToken) {
        this.logger.debug('Unauthorized api or ws request!');
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }
}
