import {
  Post,
  Get,
  Res,
  HttpCode,
  Body,
  UseGuards,
  Logger,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiGuard } from '../../guards';
import { UsersDto } from '../../dtos/users.dto';
import { ApiBody, ApiHeader, ApiTags } from '@nestjs/swagger';
import { CronService } from '../cron';
import { ConfigService } from 'src/config/config.service';

@ApiTags('Users')
@Controller('/users')
// @UseGuards(ApiGuard)
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
    console.log("dat",data)
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

  @Get('/github-login')
  public async githubLoginUrl() {
    const resp = await this.usersService.githubLoginUrl();
    return resp;
  }

  @Get('/github-receive-callback')
  public async githubReceiveCallback(@Res() res: any, @Req() req: any) {
    const resp = await this.usersService.githubReceiveCallback(req.query);
    res.redirect(301, resp.clientRedirectUrl);
  }

}
