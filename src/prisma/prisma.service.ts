import {
  Injectable,
  InternalServerErrorException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    try {
      console.log('here');
      await this.$connect();
    } catch (error) {
      if (error instanceof PrismaClientInitializationError) {
        if (error.errorCode === 'P1001') {
          throw new InternalServerErrorException(
            'Server was unable to connect to db. Ensure that DB server is running or connection string is set properly.',
          );
        }
      }
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Only for test db
  cleanDb() {
    if (process.env.NODE_ENV === 'production') return;
    return this.$transaction([
      this.note.deleteMany(),
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
