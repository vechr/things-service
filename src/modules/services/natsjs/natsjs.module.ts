import { Global, Module } from '@nestjs/common';
import { NatsjsSubscriber } from './natsjs.subscriber';

@Global()
@Module({
  providers: [NatsjsSubscriber],
  exports: [NatsjsSubscriber],
})
export class NatsjsModule {}
