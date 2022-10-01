import { Prisma, Topic } from '@prisma/client';
import { IListRequestQuery } from '@/shared/types/query.type';

export type TListTopicRequestQuery = IListRequestQuery<
  Topic,
  Prisma.TopicWhereInput
>;

export type TTopicRequestParams = {
  deviceId: string;
};
