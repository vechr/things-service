import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { PrismaModule } from './prisma/prisma.module';
import { logger } from './shared/utils/log.util';

export const NATS_SEVICE = 'NATS_SERVICE';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: { logger },
    }),

    //plugins
    PrismaModule,
  ],
})
export default class NatsModule {}
