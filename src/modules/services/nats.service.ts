import log from '@/shared/utils/log.util';
import { NatsConnection, StringCodec } from 'nats';
import { KV, KvOptions } from 'nats/lib/nats-base-client/types';

export class NatsService {
  constructor(private nats: NatsConnection) {}

  public static kv: KV;

  public static sc = StringCodec();

  async createBucket(nameBucket: string, opts?: Partial<KvOptions>) {
    try {
      const js = await this.nats.jetstream();
      NatsService.kv = await js.views.kv(nameBucket, opts);
    } catch (error) {
      log.error(`NATS ${JSON.stringify(error)}`);
    }
  }
}
