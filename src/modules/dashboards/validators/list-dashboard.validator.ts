import { Prisma, Dashboard } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IListDashboardRequestQuery } from '../requests/list-dashboard.request';
import { BaseQueryValidator, OperatorQuery } from '@/shared/types/query.type';

class ListDashboardQueryField implements Prisma.DashboardWhereInput {
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

export class ListDashboardQueryValidator extends BaseQueryValidator<Dashboard> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListDashboardQueryField)
  @ApiPropertyOptional({ type: ListDashboardQueryField })
  field?: ListDashboardQueryField;
}

class FilterDashboardQueryValidator implements IListDashboardRequestQuery {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListDashboardQueryValidator)
  filters: ListDashboardQueryValidator;
}

export default class ListDashboardValidator {
  @IsObject()
  params: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => FilterDashboardQueryValidator)
  query: FilterDashboardQueryValidator;

  @IsObject()
  body: Record<string, any>;
}
