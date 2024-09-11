import {
  connect,
  ConnectionOptions,
  KV,
  KvOptions,
  NatsConnection,
  Subscription,
  SubscriptionOptions,
} from 'nats';
import { IBaseNatsClient } from './domain/entities/interfaces/base.interface';
import { sleep } from '@/core/base/frameworks/shared/utils/sleep.util';
import log from '@/core/base/frameworks/shared/utils/log.util';

export class NatsjsService implements IBaseNatsClient {
  public nats: NatsConnection;
  public subscriber: Subscription;
  public kv: KV;
  public logger = log;

  async connect(broker: ConnectionOptions) {
    try {
      await connect(broker).then((nats) => {
        this.nats = nats;
        this.logger.info(`Nats.js Subscriber Connected to ${broker.servers}!`);
      });
    } catch (error) {
      this.logger.error('Failed to connect to NATS.', error);
      await sleep(5000);
      await this.connect(broker);
    }
  }

  async disconnect(broker: ConnectionOptions) {
    try {
      await this.nats.close();
    } catch (err) {
      this.logger.error(
        `error connecting to ${JSON.stringify(broker.servers)}`,
      );
    }
  }

  subscribe(
    subject: string,
    onSubscribe: (sub: Subscription) => Promise<void>,
    subscriberConfig?: SubscriptionOptions,
  ) {
    this.subscriber = this.nats.subscribe(subject, subscriberConfig);
    onSubscribe(this.subscriber);
    this.logger.info(`Success subscribe to: ${subject}!`);

    this.subscriber.closed
      .then(() => {
        this.logger.info('subscription closed');
      })
      .catch((err) => {
        this.logger.error(`subscription closed with an error ${err.message}`);
      });
  }

  async createBucket(
    nameBucket: string,
    opts?: Partial<KvOptions>,
  ): Promise<void> {
    try {
      const js = this.nats.jetstream();
      await js.views.kv(nameBucket, opts).then((kv) => {
        this.kv = kv;
        this.logger.info(`Success create bucket kv: ${nameBucket}!`);
      });
    } catch (error) {
      this.logger.error(`NATS ${JSON.stringify(error)}`);
    }
  }
}
