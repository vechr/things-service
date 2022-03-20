import { Module } from '@nestjs/common';
import { ThingsModule } from './things/things.module';

@Module({
  imports: [ThingsModule],
})
export class AppModule {}
