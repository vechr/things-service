import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import appConstant from './constants/app.constant';

(async function() {
  const app = await NestFactory.create(AppModule);
  await app.listen(appConstant.APP_PORT);
})();
