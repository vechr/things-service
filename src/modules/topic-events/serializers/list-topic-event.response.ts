import { TopicEvent } from '@prisma/client';

export default class ListTopicEventResponse implements TopicEvent {
  id: string;
  topicId: string;
  name: string;
  description: string | null;
  eventExpression: string | null;
  notificationEmailId: string[];
  bodyEmail: string | null;
  htmlBodyEmail: string | null;
  createdAt: Date;
  updatedAt: Date;
}
