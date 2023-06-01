import { Post, Get, Res, Render, HttpCode, Body } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('')
  @HttpCode(200)
  async findUsers(@Body() data: any) {
    return await this.usersService.findUsers(data);
  }

  @Get('')
  async getUsers() {
    return await this.usersService.getUsers();
  }

  @Post('adduser')
  @HttpCode(200)
  async addUser(@Body() data: any) {
    return await this.usersService.addUser(data);
  }
}
