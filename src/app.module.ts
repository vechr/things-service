import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { OpenTelemetryModule } from 'nestjs-otel';
import { TerminusModule } from '@nestjs/terminus';
import { WinstonModule } from 'nest-winston';
import { winstonModuleOptions } from '@utils/log.util';
import HealthModule from '@health/health.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from '@redis/client';
import { redisStore } from 'cache-manager-redis-yet';
import appConfig from './config/app.config';
import { InstrumentMiddleware } from './core/base/frameworks/shared/middlewares/instrument.middleware';
import { CoreModule } from './core/modules/core.module';
import AuthModule from './core/base/frameworks/auth/auth.module';
import { RegistrationModule } from './modules/registration.module';

const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
  metrics: {
    hostMetrics: true,
    apiMetrics: {
      enable: true,
      ignoreRoutes: ['/favicon.ico', '/health', '/'],
    },
  },
});

const WinstonLoggerModule = WinstonModule.forRootAsync({
  useFactory: () => winstonModuleOptions,
});

@Module({
  imports: [
    // framework
    TerminusModule,
    OpenTelemetryModuleConfig,
    WinstonLoggerModule,
    HealthModule,
    AuthModule,
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      isGlobal: true,
      ttl: appConfig.REDIS_TTL,
      url: appConfig.REDIS_URL,
    }),

    CoreModule,
    RegistrationModule,
  ],
})
export default class HttpModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(InstrumentMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
