import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import {
  ConnectionOptions,
  NatsConnection,
  StringCodec,
  Subscription,
} from 'nats';
import { KV, KvOptions } from 'nats/lib/nats-base-client/types';
import { OtelInstanceCounter, OtelMethodCounter } from 'nestjs-otel';
import { ThingsBusinessLogic } from '../things.logic';
import { NatsjsService } from './natsjs.service';
import { ISubscriber } from './interfaces/subscriber.interface';
import appConfig from '@/constants/app.constant';

@Injectable()
@OtelInstanceCounter()
export class NatsjsSubscriber
  extends NatsjsService
  implements OnApplicationShutdown, OnModuleInit, ISubscriber
{
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
        const thingsLogic = new ThingsBusinessLogic(kv, nats);

        const subjectParses: string[] = m.subject.split('.');

        const sc = StringCodec();
        // Value from Subject
        const data = sc.decode(m.data);

        await thingsLogic.checkMessage(subjectParses[6], data);
      }
    });
  }
}
