import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import { VersioningType } from '@nestjs/common';
import { HttpModule } from './http.module';
import appConstant from './constants/app.constant';
import UnknownExceptionsFilter from './shared/filters/unknown.filter';
import HttpExceptionFilter from './shared/filters/http.filter';
import ContextInterceptor from './shared/interceptors/context.interceptor';
import log from './shared/utils/log.util';
import NatsModule from './nats.module';
import { NatsService } from './modules/services/nats.service';
import { NatsHelper } from './shared/helpers/nats.helper';
import { ValidationHelper } from './shared/helpers/validation.helper';

const httpServer = new Promise(async (resolve, reject) => {
  try {
    const app = await NestFactory.create(HttpModule);
    app.setGlobalPrefix('api');
    app.enableCors();
    app.useGlobalFilters(
      new UnknownExceptionsFilter(),
      new HttpExceptionFilter(),
    );
    app.enableVersioning({
      defaultVersion: '1',
      type: VersioningType.URI,
    });
    app.useGlobalInterceptors(new ContextInterceptor());
    app.use(
      '/api/things/public',
      express.static(join(__dirname, '..', 'public')),
    );
    const option = {
      customCss: `
      .topbar-wrapper img {content:url('/api/things/public/logo.svg'); width:200px; height:auto;}
      .swagger-ui .topbar { background: linear-gradient(45deg, rgba(0,209,255,1) 42%, rgba(0,217,139,1) 100%); }`,
      customfavIcon: `/api/things/public/logo.svg`,
      customSiteTitle: 'Vechr API Things Services',
    };
    const config = new DocumentBuilder()
      .setTitle('Things Service API Documentation')
      .setDescription(
        'This is a Things Service for creating Metadata IoT system',
      )
      .setVersion('1.0.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/things', app, document, option);

    app.useGlobalInterceptors(new ContextInterceptor());

    await app
      .listen(appConstant.APP_PORT)
      .then(() =>
        log.info(`Http server started at PORT: ${appConstant.APP_PORT}`),
      );

    resolve(true);
  } catch (error) {
    reject(error);
  }
});

const natsServer = new Promise(async (resolve, reject) => {
  try {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      NatsModule,
      {
        transport: Transport.NATS,
        options: {
          servers: [appConstant.NATS_URL],
        },
      },
    );

    await app
      .listen()
      .then(() => log.info(`Nest nats started at: ${appConstant.NATS_URL}`));

    resolve(true);
  } catch (error) {
    reject(error);
  }
});

(async function () {
  await Promise.all([httpServer, natsServer]);
  const natsService = new NatsService(
    await NatsHelper.getConnection(),
    new ValidationHelper(log),
  );
  await natsService.createBucket('kremes_topics', { history: 5 });
  await natsService.subscribe(
    'Vechr.DashboardID.*.DeviceID.*.TopicID.*.Topic.>',
  );
})();
