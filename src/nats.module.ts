import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { TopicModule } from './modules/topics/topic.module';
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
    TopicModule,
  ],
})
export default class NatsModule {}
