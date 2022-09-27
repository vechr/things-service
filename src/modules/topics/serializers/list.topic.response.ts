import { Topic, WidgetType } from '@prisma/client';

export default class ListTopicResponse implements Topic {
  id: string;
  deviceId: string;
  name: string;
  description: string | null;
  widgetType: WidgetType | null;
  createdAt: Date;
  updatedAt: Date;
}
