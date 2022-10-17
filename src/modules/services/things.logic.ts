import { StringCodec } from 'nats';
import { KV, NatsConnection } from 'nats/lib/nats-base-client/types';
import { EventRequesTopicDto, EventSendEmailDto } from './dto';
import log from '@/shared/utils/log.util';
import { ITopic, ITopicEvent } from '@/shared/types';
import { ValidationHelper } from '@/shared/helpers/validation.helper';

export class ThingsBusinessLogic {
  private validationTopic: ValidationHelper = new ValidationHelper();
  public topicData: ITopic | undefined = undefined;

  constructor(private kv: KV, private nats: NatsConnection) {}

  async checkMessage(topicId: string, data: string): Promise<void> {
    // Ambil informasi value dari key
    this.topicData = await this.getTopicKV(topicId);

    if (this.topicData === undefined) {
      log.error("topic's not defined ");
      return;
    }

    if (this.topicData.widgetType === undefined) {
      if (this.topicData.topicEvents !== undefined) {
        this.sendEmail(data, this.topicData.topicEvents);
      }
    } else {
      if (this.validationTopic.validation(this.topicData.widgetType, data)) {
        if (this.topicData.topicEvents !== undefined) {
          this.sendEmail(data, this.topicData.topicEvents);
        }

        // Set kembali ke undefined
        this.topicData = undefined;
      }
    }
  }

  async getTopicKV(topicId: string): Promise<any> {
    const sc = StringCodec();
    // Ambil informasi value dari key
    const e = await this.kv.get(topicId);

    // Decoding value dari key
    if (e) {
      return JSON.parse(sc.decode(e?.value));
    } else {
      this.nats.publish(
        'set.topic.widget.kv',
        sc.encode(new EventRequesTopicDto(topicId).toString()),
      );

      const e2 = await this.kv.get(topicId);
      if (e2) {
        return JSON.parse(sc.decode(e2?.value));
      }
    }

    return undefined;
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
