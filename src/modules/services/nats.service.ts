import { NatsConnection, StringCodec } from 'nats';
import { KV, KvOptions } from 'nats/lib/nats-base-client/types';
import { EventRequesTopicDto, EventSendEmailDto } from './dto';
import { ValidationHelper } from '@/shared/helpers/validation.helper';
import { ITopic, ITopicEvent } from '@/shared/types';
import log from '@/shared/utils/log.util';

export class NatsService {
  constructor(
    private nats: NatsConnection,
    private validationTopic: ValidationHelper,
  ) {}

  public static kv: KV;

  public static topicData: ITopic | undefined = undefined;

  public static sc = StringCodec();

  async createBucket(nameBucket: string, opts?: Partial<KvOptions>) {
    try {
      const js = await this.nats.jetstream();
      NatsService.kv = await js.views.kv(nameBucket, opts);
    } catch (error) {
      log.error(`NATS ${JSON.stringify(error)}`);
    }
  }

  public async getTopicKV(topicId: string): Promise<any> {
    const sc = StringCodec();
    // Ambil informasi value dari key
    const e = await NatsService.kv.get(topicId);

    // Decoding value dari key
    if (e) {
      return JSON.parse(sc.decode(e?.value));
    } else {
      this.nats.publish(
        'set.topic.widget.kv',
        sc.encode(new EventRequesTopicDto(topicId).toString()),
      );

      const e2 = await NatsService.kv.get(topicId);
      if (e2) {
        return JSON.parse(sc.decode(e2?.value));
      }
    }

    return undefined;
  }

  async subscribe(subject: string) {
    try {
      const sc = StringCodec();

      const sub = this.nats.subscribe(subject);

      for await (const m of sub) {
        const subjectParses: string[] = m.subject.split('.');

        // Value from Subject
        const data = sc.decode(m.data);

        // Ambil informasi value dari key
        NatsService.topicData = await this.getTopicKV(subjectParses[6]);

        if (NatsService.topicData === undefined) {
          log.error("topic's not defined ");
          continue;
        }

        if (NatsService.topicData.widgetType === undefined) {
          if (NatsService.topicData.topicEvents !== undefined) {
            this.sendEmail(data, NatsService.topicData.topicEvents);
          }
        } else {
          if (
            this.validationTopic.validation(
              NatsService.topicData.widgetType,
              data,
            )
          ) {
            if (NatsService.topicData.topicEvents !== undefined) {
              this.sendEmail(data, NatsService.topicData.topicEvents);
            }

            // Set kembali ke undefined
            NatsService.topicData = undefined;
          }
        }
      }

      sub.closed
        .then(() => {
          log.info('subscription closed');
          console.info('subscription closed');
        })
        .catch((err) => {
          log.error(`subscription closed with an error ${err.message}`);
        });
    } catch (error) {
      log.error(`${error}`);
    }
  }

  public sendEmail(data: string, topicEvent: ITopicEvent[]) {
    const sc = StringCodec();
    topicEvent.map((val) => {
      if (data === val.eventExpression)
        this.nats.publish(
          'notification.email',
          sc.encode(
            new EventSendEmailDto(
              val.notificationEmailId,
              val.bodyEmail ?? '',
              val.htmlBodyEmail ?? '',
            ).toString(),
          ),
        );
      log.info(val.eventExpression ?? '');
    });
  }
}
