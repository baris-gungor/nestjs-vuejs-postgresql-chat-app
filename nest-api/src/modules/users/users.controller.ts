import {
  Post,
  Get,
  Res,
  Render,
  HttpCode,
  Body,
  UseGuards,
  Logger,
  UsePipes,
  ValidationPipe,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiGuard } from '../../guards';
import { UsersDto } from '../../dtos/users.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CronService } from '../cron';

@ApiTags('Users')
@Controller('/users')
@UseGuards(ApiGuard)
@ApiHeader({
  name: 'auth',
  description:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM2ODUwMjMsImV4cCI6MTcwMzY4ODYyM30.0f2e5j9DSWjdttKspU0pjCh_sBJaWzvp_KD1K6mIc5c',
  required: true,
})
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cronService: CronService,
  ) {}
  private readonly logger = new Logger(UsersController.name);
  public tokentoken = this.cronService.getAccessToken();

  @Post('/login')
  @HttpCode(200)
  @ApiBody({
    type: UsersDto.UserLogin,
    description: 'User info required',
  })
  @UsePipes(new ValidationPipe())
  async findUsers(@Body() data: UsersDto.UserLogin) {
    return await this.usersService.userLogin(data);
  }

  @Get('/allUsers')
  async getUsers() {
    return await this.usersService.getUsers();
  }

  @Post('/add')
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @ApiBody({
    type: UsersDto.UserLogin,
    description: 'User info required',
  })
  async addUser(@Body() data: UsersDto.UserLogin) {
    return await this.usersService.addUser(data);
  }
}
