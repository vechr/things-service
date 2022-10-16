import { Topic, TopicEvent, WidgetType } from '@prisma/client';
import { Type } from 'class-transformer';

export class ListTopicEventResponse implements TopicEvent {
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

export default class ListTopicResponse implements Topic {
  id: string;
  deviceId: string;
  name: string;
  description: string | null;
  widgetType: WidgetType | null;
  createdAt: Date;
  updatedAt: Date;
  @Type(() => ListTopicEventResponse)
  topicEvents: ListTopicEventResponse[];
}
