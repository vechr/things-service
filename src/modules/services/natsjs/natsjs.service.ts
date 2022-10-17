import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConnectionOptions, SubscriptionOptions } from 'nats';
import {
  KV,
  KvOptions,
  NatsConnection,
  Subscription,
} from 'nats/lib/nats-base-client/types';
import { IBaseNatsClient } from './interfaces/base.interface';
import { NatsjsSubscriber } from './natsjs.subscriber';
import log from '@/shared/utils/log.util';

interface NatsSubscriberOptions {
  subject: string;
  broker: ConnectionOptions;
  subscriberConfig?: SubscriptionOptions | undefined;
  onSubscribe: (
    subscriber: Subscription,
    kv: KV,
    nats: NatsConnection,
  ) => Promise<void>;
  nameBucket: string;
  bucketOpts?: Partial<KvOptions> | undefined;
}

@Injectable()
export class NatsService implements OnApplicationShutdown {
  private readonly natsClient: IBaseNatsClient[] = [];
  public subscriber: Subscription;
  public kv: KV;

  async subscribe({
    broker,
    subject,
    subscriberConfig,
    onSubscribe,
    nameBucket,
    bucketOpts,
  }: NatsSubscriberOptions): Promise<void> {
    const subscriber = new NatsjsSubscriber(
      log,
      broker,
      subject,
      subscriberConfig,
    );
    await subscriber.connect();
    await subscriber.createBucket(nameBucket, bucketOpts);
    await subscriber.subscribe(onSubscribe);
    this.kv = subscriber.kv;
    this.subscriber = subscriber.subscriber;
    this.natsClient.push(subscriber);
  }

  async onApplicationShutdown() {
    for (const client of this.natsClient) {
      await client.disconnect();
    }
  }
}
