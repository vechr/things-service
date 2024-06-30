import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import {
  ConnectionOptions,
  KV,
  KvOptions,
  NatsConnection,
  StringCodec,
  Subscription,
} from 'nats';
import { OtelInstanceCounter, OtelMethodCounter } from 'nestjs-otel';
import { ThingsUseCase } from './domain/usecase/things.usecase';
import { NatsjsService } from './natsjs.service';
import { ISubscriber } from './domain/entities/interfaces/subscriber.interface';
import appConfig from '@/config/app.config';
import { ChartUseCase } from './domain/usecase/chart.usecase';

@Injectable()
@OtelInstanceCounter()
export class NatsjsSubscriber
  extends NatsjsService
  implements OnApplicationShutdown, OnModuleInit, ISubscriber
{
  constructor(private chartUseCase: ChartUseCase) {
    super();
  }

  private brokerConfig: ConnectionOptions = {
    servers: appConfig.NATS_URL,
    maxReconnectAttempts: 10,
    tls: {
      caFile: appConfig.NATS_CA,
      keyFile: appConfig.NATS_KEY,
      certFile: appConfig.NATS_CERT,
    },
  };

  private bucketConfig: Partial<KvOptions> = { history: 5 };

  async onModuleInit() {
    await this.connect(this.brokerConfig);
    await this.createBucket('vechr_topics', this.bucketConfig);
    await this.subscribeThings(
      'Vechr.DashboardID.*.DeviceID.*.TopicID.*.Topic.>',
      this.kv,
      this.nats,
    );
  }

  async onApplicationShutdown() {
    await this.disconnect(this.brokerConfig);
  }

  @OtelMethodCounter()
  async subscribeThings(subject: string, kv: KV, nats: NatsConnection) {
    this.subscribe(subject, async (sub: Subscription): Promise<void> => {
      for await (const m of sub) {
        const thingsLogic = new ThingsUseCase(kv, nats, this.chartUseCase);

        const subjectParses: string[] = m.subject.split('.');

        const sc = StringCodec();
        // Value from Subject
        const data = sc.decode(m.data);

        await thingsLogic.checkMessage(subjectParses[6], data);
      }
    });
  }
}
