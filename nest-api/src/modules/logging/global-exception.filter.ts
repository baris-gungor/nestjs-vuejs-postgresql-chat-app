import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { LoggingService } from './logging.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // Log error to database
    await this.loggingService.logError(exception.message);
    // Handle the response
    response.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
}
