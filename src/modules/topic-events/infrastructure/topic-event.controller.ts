import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TopicEventUseCase } from '../domain/usecase/topic-event.usecase';
import {
  CreateTopicEventSerializer,
  DeleteTopicEventSerializer,
  GetTopicEventSerializer,
  ListTopicEventSerializer,
  UpdateTopicEventSerializer,
  UpsertTopicEventSerializer,
} from '@/modules/topic-events/domain/entities/topic-event.serializer';
import {
  CreateTopicEventValidator,
  DeleteTopicEventBatchBodyValidator,
  DeleteTopicEventParamsValidator,
  FilterCursorTopicEventQueryValidator,
  FilterPaginationTopicEventQueryValidator,
  GetTopicEventParamsValidator,
  ListCursorTopicEventQueryValidator,
  ListPaginationTopicEventQueryValidator,
  UpdateTopicEventParamsValidator,
  UpdateTopicEventValidator,
  UpsertTopicEventValidator,
} from '@/modules/topic-events/domain/entities/topic-event.validator';
import { ControllerFactory } from '@/core/base/infrastructure/factory.controller';
import { OtelInstanceCounter } from 'nestjs-otel';

@ApiTags('TopicEvent')
@OtelInstanceCounter()
@Controller('topic-event')
export class TopicEventController extends ControllerFactory<
  UpsertTopicEventValidator,
  CreateTopicEventValidator,
  GetTopicEventParamsValidator,
  UpdateTopicEventValidator,
  UpdateTopicEventParamsValidator,
  DeleteTopicEventBatchBodyValidator,
  DeleteTopicEventParamsValidator
>(
  'topic-event',
  'topic-event',
  FilterPaginationTopicEventQueryValidator,
  FilterCursorTopicEventQueryValidator,
  ListTopicEventSerializer,
  ListPaginationTopicEventQueryValidator,
  ListCursorTopicEventQueryValidator,
  UpsertTopicEventSerializer,
  UpsertTopicEventValidator,
  CreateTopicEventSerializer,
  CreateTopicEventValidator,
  GetTopicEventSerializer,
  GetTopicEventParamsValidator,
  UpdateTopicEventSerializer,
  UpdateTopicEventValidator,
  UpdateTopicEventParamsValidator,
  DeleteTopicEventSerializer,
  DeleteTopicEventBatchBodyValidator,
  DeleteTopicEventParamsValidator,
) {
  constructor(public _usecase: TopicEventUseCase) {
    super();
  }
}
