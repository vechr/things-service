import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { OpenTelemetryModule } from 'nestjs-otel';
import { LoggerModule } from 'nestjs-pino';
import AuthModule from './core/auth.module';
import AuditModule from './modules/audits/audit.module';
import { DashboardModule } from './modules/dashboards/dashboards.module';
import { DeviceModule } from './modules/devices/device.module';
import HealthModule from './modules/health/health.module';
import { NatsjsModule } from './modules/services/natsjs/natsjs.module';
import { TopicEventModule } from './modules/topic-events/topic-event.module';
import { TopicModule } from './modules/topics/topic.module';
import { PrismaModule } from './prisma/prisma.module';
import { InstrumentMiddleware } from './shared/middlewares/instrument.middleware';
import { logger } from './shared/utils/log.util';

const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
  metrics: {
    hostMetrics: true,
    apiMetrics: {
      enable: true,
    },
  },
});

const PinoLoggerModule = LoggerModule.forRoot({
  pinoHttp: {
    customLogLevel: function (_, res, err) {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'error';
      } else if (res.statusCode >= 500 || err) {
        return 'fatal';
      } else if (res.statusCode >= 300 && res.statusCode < 400) {
        return 'warn';
      } else if (res.statusCode >= 200 && res.statusCode < 300) {
        return 'info';
      }
      return 'debug';
    },
    logger,
  },
});

@Module({
  imports: [
    OpenTelemetryModuleConfig,
    PinoLoggerModule,
    //plugins
    PrismaModule,
    NatsjsModule,
    AuthModule,
    AuditModule,

    DashboardModule,
    DeviceModule,
    TopicModule,
    TopicEventModule,
    TerminusModule,
    HealthModule,
  ],
})
export class HttpModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(InstrumentMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
