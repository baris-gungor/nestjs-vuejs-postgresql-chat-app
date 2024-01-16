import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Logs } from '../../domain';

@Injectable()
export class LoggingService {
  constructor(
    @Inject('LOGS_REPOSITORY')
    private logsRepository: Repository<Logs>,
  ) {}

  async logError(message: string): Promise<void> {
    const logs = new Logs();
    logs.requestTime = new Date();
    logs.message = message;
    this.saveLog(logs);
  }

  async logResponse(request, response, data, startTime, endTime) {
    const duration = endTime.getTime() - startTime.getTime();
    const logs = new Logs();
    logs.requestTime = startTime;
    logs.message = 'api_request';
    logs.response = data;
    logs.responseMs = duration;
    logs.responseTime = endTime;
    logs.statusCode = response.statusCode;
    logs.request = {
      path: request.originalUrl,
      method: request.method,
      params: request.params,
      query: request.query,
      body: request.body,
      code: response.statusCode,
      headers: request.headers,
    };
    this.saveLog(logs);
  }

  private async saveLog(logs: Logs) {
    await this.logsRepository.save(logs);
  }
}
