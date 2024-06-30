import { ConnectionOptions, KvOptions } from 'nats';

export class IBaseNatsClient {
  connect: (broker: ConnectionOptions) => Promise<void>;
  disconnect: (lbroker: ConnectionOptions) => Promise<void>;
  createBucket: (
    nameBucket: string,
    opts?: Partial<KvOptions>,
  ) => Promise<void>;
}
