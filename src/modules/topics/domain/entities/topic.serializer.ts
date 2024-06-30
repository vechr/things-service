import { TopicEvent } from '@/modules/topic-events/domain/entities/topic-event.entity';
import { $Enums } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { Topic } from './topic.entity';

export class ListTopicSerializer implements Topic {
  @Exclude()
  topicEvents: TopicEvent;

  deviceId: string;
  widgetType: $Enums.WidgetType | null;
  name: string;
  description: string | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateTopicSerializer implements Topic {
  @Exclude()
  topicEvents: TopicEvent;

  deviceId: string;
  widgetType: $Enums.WidgetType | null;
  name: string;
  description: string | null;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
export class UpsertTopicSerializer extends CreateTopicSerializer {}
export class UpdateTopicSerializer extends CreateTopicSerializer {}
export class DeleteTopicSerializer extends CreateTopicSerializer {}
export class GetTopicSerializer extends CreateTopicSerializer {}
