import { ApiPropertyOptional } from '@nestjs/swagger';
import { DeviceType, Prisma } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { TListDeviceTypeRequestQuery } from '../requests/list-device-type.request';
import { BaseQueryValidator, OperatorQuery } from '@/shared/types/query.type';

class ListDeviceTypeQueryField implements Prisma.DeviceTypeWhereInput {
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

export class ListDeviceTypeQueryValidator extends BaseQueryValidator<DeviceType> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListDeviceTypeQueryField)
  @ApiPropertyOptional({ type: ListDeviceTypeQueryField })
  field?: ListDeviceTypeQueryField;
}

class FilterDeviceTypeQueryValidator implements TListDeviceTypeRequestQuery {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListDeviceTypeQueryValidator)
  filters: ListDeviceTypeQueryValidator;
}

export default class ListDeviceTypeValidator {
  @IsObject()
  params: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => FilterDeviceTypeQueryValidator)
  query: FilterDeviceTypeQueryValidator;

  @IsObject()
  body: Record<string, any>;
}
