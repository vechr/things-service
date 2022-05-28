import { NestFactory } from '@nestjs/core';
import { HttpModule } from './http.module';
import appConstant from './constants/app.constant';
import UnknownExceptionsFilter from './shared/filters/unknown.filter';
import HttpExceptionFilter from './shared/filters/http.filter';
import ContextInterceptor from './shared/interceptors/context.interceptor';
import log from './shared/utils/log.util';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import NatsModule from './nats.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import { join } from 'path';

const httpServer = new Promise(async (resolve, reject) => {
  try {
    const app = await NestFactory.create(HttpModule);
    app.enableCors();
    app.useGlobalFilters(
      new UnknownExceptionsFilter(),
      new HttpExceptionFilter(),
    );
    app.use('/public', express.static(join(__dirname, '..', 'public')));
    const option = {
      customCss: `
      .topbar-wrapper img {content:url('/public/kreMES.svg'); width:200px; height:auto;}
      .swagger-ui .topbar { background-color: #000000; }`,
      customfavIcon: `/public/kreMES.svg`,
      customSiteTitle: 'kreMES API Things Services',
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
})();
