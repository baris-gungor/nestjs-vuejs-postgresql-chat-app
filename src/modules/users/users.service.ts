import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './users.entity';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async findUsers(data: any) {
    try {
      console.log(data);
      const res = await this.usersRepository
        .createQueryBuilder()
        .select('user')
        .from(Users, 'user')
        .where('user.username = :username', { username: data.username })
        .getOne();
      if (res === null) {
        return { userExists: false, loginSuccess: false };
      } else {
        if (res.password === data.password) {
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
      console.log(`addUsers hata: ${err}`);
      return err;
    }
  }

  async getUsers() {
    return await this.usersRepository.find();
  }

  // async saveUsers(data) {
  //   try {
  //     return await this.usersRepository.save(data);
  //   } catch (err) {
  //     return `addUsers hata: ${err}`;
  //   }
  // }
}
