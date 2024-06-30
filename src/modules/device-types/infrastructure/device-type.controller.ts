import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeviceTypeUseCase } from '../domain/usecase/device-type.usecase';
import {
  CreateDeviceTypeSerializer,
  DeleteDeviceTypeSerializer,
  GetDeviceTypeSerializer,
  ListDeviceTypeSerializer,
  UpdateDeviceTypeSerializer,
  UpsertDeviceTypeSerializer,
} from '@/modules/device-types/domain/entities/device-type.serializer';
import {
  CreateDeviceTypeValidator,
  DeleteDeviceTypeBatchBodyValidator,
  DeleteDeviceTypeParamsValidator,
  FilterCursorDeviceTypeQueryValidator,
  FilterPaginationDeviceTypeQueryValidator,
  GetDeviceTypeParamsValidator,
  ListCursorDeviceTypeQueryValidator,
  ListPaginationDeviceTypeQueryValidator,
  UpdateDeviceTypeParamsValidator,
  UpdateDeviceTypeValidator,
  UpsertDeviceTypeValidator,
} from '@/modules/device-types/domain/entities/device-type.validator';
import { ControllerFactory } from '@/core/base/infrastructure/factory.controller';
import { OtelInstanceCounter } from 'nestjs-otel';

@ApiTags('DeviceType')
@OtelInstanceCounter()
@Controller('device-type')
export class DeviceTypeController extends ControllerFactory<
  UpsertDeviceTypeValidator,
  CreateDeviceTypeValidator,
  GetDeviceTypeParamsValidator,
  UpdateDeviceTypeValidator,
  UpdateDeviceTypeParamsValidator,
  DeleteDeviceTypeBatchBodyValidator,
  DeleteDeviceTypeParamsValidator
>(
  'device-type',
  'device-type',
  FilterPaginationDeviceTypeQueryValidator,
  FilterCursorDeviceTypeQueryValidator,
  ListDeviceTypeSerializer,
  ListPaginationDeviceTypeQueryValidator,
  ListCursorDeviceTypeQueryValidator,
  UpsertDeviceTypeSerializer,
  UpsertDeviceTypeValidator,
  CreateDeviceTypeSerializer,
  CreateDeviceTypeValidator,
  GetDeviceTypeSerializer,
  GetDeviceTypeParamsValidator,
  UpdateDeviceTypeSerializer,
  UpdateDeviceTypeValidator,
  UpdateDeviceTypeParamsValidator,
  DeleteDeviceTypeSerializer,
  DeleteDeviceTypeBatchBodyValidator,
  DeleteDeviceTypeParamsValidator,
) {
  constructor(public _usecase: DeviceTypeUseCase) {
    super();
  }
}
