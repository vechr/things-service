import { Prisma, TopicEvent } from '@prisma/client';
import { IListRequestQuery } from '@/shared/types/query.type';

export type TListTopicEventRequestQuery = IListRequestQuery<
  TopicEvent,
  Prisma.TopicEventWhereInput
>;

export type TTopicEventRequestParams = {
  topicId: string;
};
