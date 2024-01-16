import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from '../../domain';
import * as bcrypt from 'bcrypt';
import { UsersDto } from '../../dtos/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY') private usersRepository: Repository<Users>,
  ) {}
  private readonly logger = new Logger(UsersService.name);

  async userLogin(data: any) {
    try {
      const res = await this.usersRepository
        .createQueryBuilder()
        .select('user')
        .from(Users, 'user')
        .where('user.username = :username', { username: data.username })
        .getOne();
      if (res === null) {
        return { userExists: false, loginSuccess: false };
      } else {
        this.logger.debug(await bcrypt.compare(data.password, res.password));
        if ((await bcrypt.compare(data.password, res.password)) === true) {
          const updateDate = new Date();
          const lastUpdate = await this.usersRepository
            .createQueryBuilder()
            .update(Users)
            .set({ updatedAt: updateDate })
            .where('id = :id', { id: res.id })
            .execute();
          return {
            userExists: true,
            loginSuccess: true,
            updateDate: updateDate,
          };
        } else {
          return { userExists: true, loginSuccess: false };
        }
      }
    } catch (err) {
      this.logger.error(`/users/login ERR: ${err}`);
      return {
        code: 200,
        message: `Error happened while loggin proccess!`,
        status: false,
      };
    }
  }

  async getUsers() {
    return await this.usersRepository.find();
  }

  async addUser(data: any) {
    try {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);
      const userFind = await this.usersRepository
        .createQueryBuilder()
        .select('user')
        .from(Users, 'user')
        .where('user.username = :username', { username: data.username })
        .getOne();
      if (userFind === null) {
        const user: UsersDto.UserLogin = {
          username: data.username,
          password: hashedPassword,
        };
        const userCreate = await this.usersRepository.save(user);
        if (userCreate && userCreate.id) {
          return {
            code: 200,
            message: 'User saved in the system!',
            status: true,
          };
        }
      } else {
        return {
          code: 200,
          message: 'Username already taken!',
          status: false,
        };
      }
    } catch (error) {
      this.logger.error(`/users/add ERR: ${error}`);
      return {
        code: 200,
        message: `Error happened while saving user in the system!`,
        status: false,
      };
    }
  }
}
