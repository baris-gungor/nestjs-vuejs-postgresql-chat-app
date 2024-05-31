import { CronService } from './../cron/cron.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from '../../domain';
import * as bcrypt from 'bcrypt';
import { UsersDto } from '../../dtos/users.dto';
import { HttpService } from '@nestjs/axios';
import { v4 as uuid } from 'uuid';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from 'src/config/config.service';
import { ChatGateway } from '../chat/chat.gateway';

const config = new ConfigService().getConfigService() as any;
@Injectable()
export class UsersService {
  constructor(
    private readonly httpService: HttpService,
    private readonly chatGateway: ChatGateway,
    private readonly cronService: CronService,
    @Inject('USERS_REPOSITORY') private usersRepository: Repository<Users>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  private readonly logger = new Logger(UsersService.name);

  async userLogin(data: any) {
    try {
      console.log('data', data);
      const res = await this.usersRepository
        .createQueryBuilder()
        .select('user')
        .from(Users, 'user')
        .where('user.username = :username', { username: data.username })
        .getOne();
      console.log('res', res);
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
      console.log('data', data);
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(data.password, saltRounds);
      const userFind = await this.usersRepository
        .createQueryBuilder()
        .select('user')
        .from(Users, 'user')
        .where('user.username = :username', { username: data.username })
        .getOne();
      console.log('hashedPassword', hashedPassword);
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
          message: 'username already taken!',
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

  public async githubLoginUrl() {
    const client_secret = 'e6d654f7dc57d27bd15ed985800947ee3db3aa1e';
    const client_id = '7972603f3e53797500b5';
    const redirect_uri = `http://${config.API_HOST}:${config.API_PORT}/users/github-receive-callback`;
    const state = uuid();
    const allow_signup = false; // example, can be changed
    const clientIdEncoded = encodeURIComponent(client_id);
    const redirectUriEncoded = encodeURIComponent(redirect_uri);
    const stateEncoded = encodeURIComponent(state);
    const clientSecretEncoded = encodeURIComponent(client_secret);
    const parameters = `client_id=${clientIdEncoded}&redirect_uri=${redirectUriEncoded}&state=${stateEncoded}&allow_signup=${allow_signup}`;
    const loginUrl = `https://github.com/login/oauth/authorize?${parameters}`;
    const githubKey = {
      clientIdEncoded,
      redirectUriEncoded,
      clientSecretEncoded,
      state,
    };
    await this.cacheManager.set('githubKey', { ...githubKey }, 600000);
    return {
      code: 200,
      message: 'Github link',
      loginUrl,
    };
  }

  public async githubReceiveCallback(query) {
    try {
      const value = (await this.cacheManager.get('githubKey')) as any;
      if (value && value.state == query.state) {
        const codeEncoded = encodeURIComponent(query.code);
        const parameters = `client_id=${value.clientIdEncoded}&redirect_uri=${value.redirectUriEncoded}&client_secret=${value.clientSecretEncoded}&code=${codeEncoded}`;
        const headers = { Accept: 'application/json' };
        const payload = {};
        const urlAccessToken = `https://github.com/login/oauth/access_token?${parameters}`;
        const respToken = await this.httpService.axiosRef.post(
          urlAccessToken,
          payload,
          {
            headers,
          },
        );
        if (respToken && respToken.data && respToken.data.access_token) {
          const urlGetUser = `https://api.github.com/user`;
          const headers = {
            Accept: 'application/json',
            Authorization: `Bearer ${respToken.data.access_token}`,
          };
          const resUserInfo = await this.httpService.axiosRef.get(urlGetUser, {
            headers,
          });
          if (resUserInfo && resUserInfo.data) {
            const clientRedirectUrl = `http://${config.VUE_APP_ClIENT_HOST}:${config.VUE_APP_CLIENT_PORT}`;
            const returnUser = { ...resUserInfo.data, clientRedirectUrl };
            const newUser = {
              username: returnUser?.login || '',
              password: `${returnUser?.id}` || '',
            };
            await this.addUser(newUser);

            const session = {
              id: returnUser?.id || '',
              username: returnUser?.login || '',
              userFirstName: returnUser?.name || '',
              avatarUrl: returnUser?.avatar_url || '',
            };
            const token = await this.cronService.createAccessToken(session);
            console.log('token:', token);
            this.chatGateway.server.emit('newEvent', session);
            return returnUser;
          }
        }
      }
    } catch (error) {
      this.logger.error('githubReceiveCallback', error);
    }
  }
}
