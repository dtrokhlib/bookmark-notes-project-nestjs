import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  // Only for test db
  cleanDb() {
    return this.$transaction([
      this.note.deleteMany(),
      this.bookmark.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
