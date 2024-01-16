import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggingService } from './logging.service';

@Injectable()
export class ResponseLoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = new Date();
    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      tap((data) => {
        const endTime = new Date();
        this.loggingService.logResponse(
          request,
          context.switchToHttp().getResponse(),
          data,
          startTime,
          endTime,
        );
      }),
    );
  }
}
