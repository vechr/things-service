import { Injectable, OnModuleInit } from '@nestjs/common';
import { StringCodec, Subscription } from 'nats';
import { KV, NatsConnection } from 'nats/lib/nats-base-client/types';
import { NatsService } from './natsjs/natsjs.service';
import { ThingsBusinessLogic } from './things.logic';
import appConfig from '@/constants/app.constant';

@Injectable()
export class ThingsSubscriber implements OnModuleInit {
  constructor(private readonly natsService: NatsService) {}

  async onModuleInit() {
    await this.natsService.subscribe({
      broker: { servers: appConfig.NATS_URL },
      subscriberConfig: { max: 10 },
      subject: 'Vechr.DashboardID.*.DeviceID.*.TopicID.*.Topic.>',
      onSubscribe: this.thingsLogic,
      nameBucket: 'kremes_topics',
      bucketOpts: { history: 5 },
    });
  }

  async thingsLogic(sub: Subscription, bucket: KV, nats: NatsConnection) {
    for await (const m of sub) {
      const thingsLogic = new ThingsBusinessLogic(bucket, nats);

      const subjectParses: string[] = m.subject.split('.');

      const sc = StringCodec();
      // Value from Subject
      const data = sc.decode(m.data);

      await thingsLogic.checkMessage(subjectParses[6], data);
    }
  }
}
