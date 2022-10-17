import { Subscription } from 'nats';
import { KV, KvOptions, NatsConnection } from 'nats/lib/nats-base-client/types';
import { IBaseNatsClient } from './base.interface';

export class ISubscriber extends IBaseNatsClient {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  subscribe: (
    onSubscribe: (
      subscriber: Subscription,
      kv: KV,
      nats: NatsConnection,
    ) => Promise<void>,
  ) => Promise<void>;
  createBucket: (
    nameBucket: string,
    opts?: Partial<KvOptions>,
  ) => Promise<void>;
}
