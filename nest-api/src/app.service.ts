import { Injectable, Inject, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { Seed } from './domain';

@Injectable()
export class AppService {
  constructor(
    @Inject('SEED_REPOSITORY') private seedRepository: Repository<Seed>,
  ) {}
  private readonly logger = new Logger(AppService.name);
  public async seedDB() {
    try {
      this.logger.debug('Application seed process started');
      const seedSQLs: string[] = fs
        .readdirSync('src/database/seeds')
        .filter((fn) => fn.endsWith('.sql'))
        .map((value) => `src/database/seeds/${value}`);
      const alreadySeeded = await this.seedRepository.find();
      for (const seed of seedSQLs) {
        const seedSQL: string = fs.readFileSync(seed, { encoding: 'utf-8' });
        const md5 = this.fileHash(seedSQL.replace(/\r\n/g, '\n'));
        const alreadySeed = alreadySeeded.find((value) => value.name === seed);
        if (
          alreadySeed &&
          (!alreadySeed.md5 || alreadySeed.md5.trim().length === 0)
        ) {
          this.logger.debug(
            `Seed file may be ${seed} already seeded. Hash empty skipping...`,
          );
          alreadySeed.md5 = md5;
          await this.seedRepository.save(alreadySeed);
        } else if (alreadySeed && alreadySeed.md5 && alreadySeed.md5 === md5) {
          this.logger.debug(
            `Seed file ${seed} already seeded with hash ${md5}`,
          );
        } else {
          await this.seedRepository
            .query(`BEGIN; ${seedSQL} COMMIT;`)
            .then(() => {
              if (!alreadySeed) {
                this.seedRepository.save({ name: seed, md5 });
              } else {
                alreadySeed.md5 = md5;
                this.seedRepository.save(alreadySeed);
              }
              this.logger.debug(`Seed File: ${seed} executed.`);
              return;
            })
            .catch((reason) => {
              this.logger.error(
                `Seed File: ${seed} failed to execute.`,
                reason,
              );
            });
        }
      }
      this.logger.debug('DB Seeding Finished.');
      return seedSQLs.length > 0;
    } catch (error) {
      this.logger.error('Application seed process gives an error', error);
    }
  }
  private fileHash(content: string): string {
    const sum = crypto.createHash('md5');
    sum.update(content);
    return sum.digest('hex');
  }
}
