import { ApiPropertyOptional } from '@nestjs/swagger';
import { Device, Prisma } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { IListDeviceRequestQuery } from '../requests/list-device.request';
import { BaseQueryValidator, OperatorQuery } from '@/shared/types/query.type';

class ListDeviceQueryField implements Prisma.DeviceWhereInput {
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
  isActive: OperatorQuery;

  @Expose()
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => OperatorQuery)
  deviceTypeId: OperatorQuery;

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

export class ListDeviceQueryValidator extends BaseQueryValidator<Device> {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListDeviceQueryField)
  @ApiPropertyOptional({ type: ListDeviceQueryField })
  field?: ListDeviceQueryField;
}

class FilterDeviceQueryValidator implements IListDeviceRequestQuery {
  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => ListDeviceQueryValidator)
  filters: ListDeviceQueryValidator;
}

export default class ListDeviceValidator {
  @IsObject()
  params: Record<string, any>;

  @ValidateNested()
  @IsObject()
  @Type(() => FilterDeviceQueryValidator)
  query: FilterDeviceQueryValidator;

  @IsObject()
  body: Record<string, any>;
}
