import { Global, Module } from '@nestjs/common';
import { ChartUseCase } from './domain/usecase/chart.usecase';
import { NatsjsSubscriber } from './natsjs.subscriber';

@Global()
@Module({
  providers: [NatsjsSubscriber, ChartUseCase],
  exports: [NatsjsSubscriber],
})
export class NatsjsModule {}
