import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Cron, CronExpression } from '@nestjs/schedule';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CronService {
  constructor() {
    this.generateAccessToken();
    this.generateUuid();
  }
  private readonly logger = new Logger(CronService.name);
  private readonly secretKey = 'yourSecretKey';
  private accessToken = '';
  private uuid: string;

  @Cron(CronExpression.EVERY_HOUR)
  generateUuid() {
    this.uuid = uuidv4();
    this.logger.debug(`uuid: ${this.uuid}`);
    return this.uuid;
  }
  getUuid() {
    return this.uuid;
  }

  // @Cron(CronExpression.EVERY_WEEK)
  generateAccessToken() {
    // const payload = {};
    // const options = { expiresIn: '1h' }; // Token expiration time
    // this.accessToken = jwt.sign(payload, this.secretKey, options);
    this.accessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM2ODUwMjMsImV4cCI6MTcwMzY4ODYyM30.0f2e5j9DSWjdttKspU0pjCh_sBJaWzvp_KD1K6mIc5c';
    this.logger.debug(`accessToken: ${this.accessToken}`);
    return this.accessToken;
  }

  createAccessToken(payload) {
    const options = { expiresIn: '1h' }; 
    const accessToken = jwt.sign(payload, this.secretKey, options);
    this.logger.debug(`accessToken: ${accessToken}`);
    return accessToken;
  }

  getAccessToken() {
    return this.accessToken;
  }
  // generateRefreshToken(userId: string): string {
  //   const payload = { userId };
  //   const options = { expiresIn: '1h' }; // Token expiration time

  //   return jwt.sign(payload, this.secretKey, options);
  // }
}
