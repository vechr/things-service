import { Prisma, TopicEvent } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IListTopicEventRequestQuery } from '../requests/list-topic-event.request';
import { BaseQueryValidator, OperatorQuery } from '@/shared/types/query.type';

class ListTopicEventQueryField implements Prisma.TopicEventWhereInput {
  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  id?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  @ApiPropertyOptional({ type: OperatorQuery })
  name?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  topicId: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  eventExpression: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  notificationEmailId: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  bodyEmail: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  htmlBodyEmail: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  description?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  createdAt?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  updatedAt?: OperatorQuery;
}

export class ListTopicEventQueryValidator extends BaseQueryValidator<TopicEvent> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListTopicEventQueryField)
  @ApiPropertyOptional({ type: ListTopicEventQueryField })
  field?: ListTopicEventQueryField;
}

class FilterTopicEventQueryValidator implements IListTopicEventRequestQuery {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListTopicEventQueryValidator)
  filters: ListTopicEventQueryValidator;
}

export default class ListTopicEventValidator {
  @IsObject()
  params: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => FilterTopicEventQueryValidator)
  query: FilterTopicEventQueryValidator;

  @IsObject()
  body: Record<string, any>;
}
