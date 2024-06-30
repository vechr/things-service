import { ITopicEvent } from './topic-event';

export interface ITopic {
  id: string;
  deviceId: string;
  name: string;
  description: string;
  widgetType?: string;
  createdAt?: string;
  updatedAt?: string;
  topicEvents?: ITopicEvent[];
}
