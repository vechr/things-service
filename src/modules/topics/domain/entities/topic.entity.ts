import { $Enums, Prisma, Topic as TTopic } from '@prisma/client';
import { IListRequestQuery } from '@/core/base/domain/entities';
import { BaseEntity } from '@/core/base/domain/entities';
import { TopicEvent } from '@/modules/topic-events/domain/entities/topic-event.entity';

export class Topic extends BaseEntity implements TTopic {
  deviceId: string;
  widgetType: $Enums.WidgetType | null;
  topicEvents: TopicEvent;
}

export type OptionalTopic = Partial<Topic>;
export type RequiredTopic = Required<Topic>;
export type TListTopicRequestQuery<P> = IListRequestQuery<
  P,
  Topic,
  Prisma.TopicWhereInput
>;
export type TGetTopicByIdRequestParams = Pick<Topic, 'id'>;
export type TUpdateTopicByIdRequestParams = Pick<Topic, 'id'>;
export type TDeleteTopicByIdRequestParams = Pick<Topic, 'id'>;
export type TCreateTopicRequestBody = Omit<
  Topic,
  'id' | 'createdAt' | 'updatedAt' | 'topicEvents'
>;
export type TUpsertTopicRequestBody = TCreateTopicRequestBody;
export type TUpdateTopicRequestBody = Partial<TCreateTopicRequestBody>;

export class QueryCreateEvent {
  constructor(
    public readonly dashboardId: string,
    public readonly deviceId: string,
    public readonly topicId: string,
    public readonly topic: string,
  ) {}

  toString() {
    return JSON.stringify({
      dashboardId: this.dashboardId,
      deviceId: this.deviceId,
      topicId: this.topicId,
      topic: this.topic,
    });
  }
}
