import { KV, NatsConnection } from 'nats/lib/nats-base-client/types';
import { IBaseNatsClient } from './base.interface';

export class ISubscriber extends IBaseNatsClient {
  subscribeThings: (
    subject: string,
    kv: KV,
    nats: NatsConnection,
  ) => Promise<void>;
}
