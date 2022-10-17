import {
  connect,
  ConnectionOptions,
  NatsConnection,
  Subscription,
  SubscriptionOptions,
} from 'nats';
import { KV, KvOptions } from 'nats/lib/nats-base-client/types';
import { ISubscriber } from './interfaces/subscriber.interface';
import { sleep } from '@/shared/utils/sleep.util';
import { ILog } from '@/shared/utils/log.util';

export class NatsjsSubscriber implements ISubscriber {
  public nats: NatsConnection;
  public subscriber: Subscription;
  public kv: KV;

  constructor(
    private readonly logger: ILog,
    private broker: ConnectionOptions,
    private readonly subject: string,
    private subscriberConfig?: SubscriptionOptions,
  ) {}

  async connect() {
    try {
      await connect(this.broker).then((nats) => {
        this.nats = nats;
        this.logger.info(
          `Nats.js Subscriber Connected to ${this.broker.servers}!`,
        );
      });
    } catch (error) {
      this.logger.error('Failed to connect to NATS.', error);
      await sleep(5000);
      await this.connect();
    }
  }

  async disconnect() {
    try {
      await this.nats.close();
    } catch (err) {
      this.logger.error(
        `error connecting to ${JSON.stringify(this.broker.servers)}`,
      );
    }
  }

  async subscribe(
    onSubscribe: (
      sub: Subscription,
      kv: KV,
      nats: NatsConnection,
    ) => Promise<void>,
  ) {
    this.subscriber = this.nats.subscribe(this.subject, this.subscriberConfig);
    onSubscribe(this.subscriber, this.kv, this.nats);
    this.logger.info(`Success subscribe to: ${this.subject}!`);

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
