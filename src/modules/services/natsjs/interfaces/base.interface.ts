export class IBaseNatsClient {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}
