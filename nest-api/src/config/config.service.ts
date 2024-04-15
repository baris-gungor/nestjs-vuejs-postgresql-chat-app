import { Injectable } from '@nestjs/common';

const dotenv = require('dotenv').config({ path: '../.env' });
@Injectable()
export class ConfigService {
  getConfigService() {
    return { ...dotenv.parsed };
  }
}
