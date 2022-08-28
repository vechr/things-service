import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { TopicEventModule } from './modules/topic-events/topic-event.module';
import { TopicModule } from './modules/topics/topic.module';
import { PrismaModule } from './prisma/prisma.module';
import { logger } from './shared/utils/log.util';

export const NATS_SEVICE = 'NATS_SERVICE';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: { logger },
    }),
    TopicModule,
    TopicEventModule,

    //plugins
    PrismaModule,
  ],
})
export default class NatsModule {}
