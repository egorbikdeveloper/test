import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ApiModule } from './api/api.module';
import * as redisStore from 'cache-manager-redis-store';

import * as PrismaClient from '@prisma/client';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';

console.log(PrismaClient);

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    UsersModule,
    ApiModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
