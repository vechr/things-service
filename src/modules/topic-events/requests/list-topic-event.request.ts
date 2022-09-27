import { Prisma, TopicEvent } from '@prisma/client';
import { IListRequestQuery } from '@/shared/types/query.type';

export type IListTopicEventRequestQuery = IListRequestQuery<
  TopicEvent,
  Prisma.TopicEventWhereInput
>;
