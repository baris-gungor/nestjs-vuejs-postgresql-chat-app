import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
const dotenv = require('dotenv').config({ path: '../.env' })

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
  createHttpOptions(): HttpModuleOptions {
    return {
      timeout: dotenv.parsed.HTTP_TIMEOUT,
      maxRedirects: dotenv.parsed.HTTP_MAX_REDIRECTS,
    };
  }
}
