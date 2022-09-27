import { Prisma, Topic } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IListTopicRequestQuery } from '../requests/list-topic.request';
import { BaseQueryValidator, OperatorQuery } from '@/shared/types/query.type';

class ListTopicQueryField implements Prisma.TopicWhereInput {
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
  deviceId?: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  widgetType?: OperatorQuery;

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

export class ListTopicQueryValidator extends BaseQueryValidator<Topic> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListTopicQueryField)
  @ApiPropertyOptional({ type: ListTopicQueryField })
  field?: ListTopicQueryField;
}

class FilterTopicQueryValidator implements IListTopicRequestQuery {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListTopicQueryValidator)
  filters: ListTopicQueryValidator;
}

export default class ListTopicValidator {
  @IsObject()
  params: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => FilterTopicQueryValidator)
  query: FilterTopicQueryValidator;

  @IsObject()
  body: Record<string, any>;
}
