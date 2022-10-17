import { Global, Module } from '@nestjs/common';
import { ThingsSubscriber } from '../things.subscriber';
import { NatsService } from './natsjs.service';

@Global()
@Module({
  providers: [NatsService, ThingsSubscriber],
  exports: [NatsService],
})
export class NatsjsModule {}
