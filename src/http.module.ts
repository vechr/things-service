import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { DashboardModule } from './modules/dashboards/dashboards.module';
import { logger } from './shared/utils/log.util';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: { logger },
    }),
    DashboardModule,
  ],
})
export class HttpModule {}
