import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { DashboardModule } from './modules/dashboards/dashboards.module';
import { DeviceModule } from './modules/devices/device.module';
import { PrismaModule } from './prisma/prisma.module';
import { logger } from './shared/utils/log.util';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: { logger },
    }),
    DashboardModule,
    DeviceModule,

    //plugins
    PrismaModule,
  ],
})
export class HttpModule {}
