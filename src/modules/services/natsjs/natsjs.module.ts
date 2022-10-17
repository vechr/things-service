import { Global, Module } from '@nestjs/common';
import { NatsjsSubscriber } from './natsjs.subscriber';
import { NatsjsService } from './natsjs.service';

@Global()
@Module({
  providers: [NatsjsService, NatsjsSubscriber],
  exports: [NatsjsService],
})
export class NatsjsModule {}
