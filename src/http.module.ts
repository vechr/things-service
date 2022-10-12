import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import AuthModule from './core/auth.module';
import { DashboardModule } from './modules/dashboards/dashboards.module';
import { DeviceModule } from './modules/devices/device.module';
import { TopicEventModule } from './modules/topic-events/topic-event.module';
import { TopicModule } from './modules/topics/topic.module';
import { PrismaModule } from './prisma/prisma.module';
import { logger } from './shared/utils/log.util';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: { logger },
    }),
    //plugins
    PrismaModule,
    AuthModule,

    DashboardModule,
    DeviceModule,
    TopicModule,
    TopicEventModule,
  ],
})
export class HttpModule {}
