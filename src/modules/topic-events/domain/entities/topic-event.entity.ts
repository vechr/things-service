import { Prisma, TopicEvent as TTopicEvent } from '@prisma/client';
import { IListRequestQuery } from '@/core/base/domain/entities';
import { BaseEntity } from '@/core/base/domain/entities';

export class TopicEvent extends BaseEntity implements TTopicEvent {
  topicId: string;
  eventExpression: string | null;
  bodyEmail: string | null;
  htmlBodyEmail: string | null;
}

export type OptionalTopicEvent = Partial<TopicEvent>;
export type RequiredTopicEvent = Required<TopicEvent>;
export type TListTopicEventRequestQuery<P> = IListRequestQuery<
  P,
  TopicEvent,
  Prisma.TopicEventWhereInput
>;
export type TGetTopicEventByIdRequestParams = Pick<TopicEvent, 'id'>;
export type TUpdateTopicEventByIdRequestParams = Pick<TopicEvent, 'id'>;
export type TDeleteTopicEventByIdRequestParams = Pick<TopicEvent, 'id'>;
export type TCreateTopicEventRequestBody = Omit<
  TopicEvent,
  'id' | 'createdAt' | 'updatedAt'
>;
export type TUpsertTopicEventRequestBody = TCreateTopicEventRequestBody;
export type TUpdateTopicEventRequestBody =
  Partial<TCreateTopicEventRequestBody>;
