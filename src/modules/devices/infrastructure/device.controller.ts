import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeviceUseCase } from '../domain/usecase/device.usecase';
import {
  CreateDeviceSerializer,
  DeleteDeviceSerializer,
  GetDeviceSerializer,
  ListDeviceSerializer,
  UpdateDeviceSerializer,
  UpsertDeviceSerializer,
} from '@/modules/devices/domain/entities/device.serializer';
import {
  CreateDeviceValidator,
  DeleteDeviceBatchBodyValidator,
  DeleteDeviceParamsValidator,
  FilterCursorDeviceQueryValidator,
  FilterPaginationDeviceQueryValidator,
  GetDeviceParamsValidator,
  ListCursorDeviceQueryValidator,
  ListPaginationDeviceQueryValidator,
  UpdateDeviceParamsValidator,
  UpdateDeviceValidator,
  UpsertDeviceValidator,
} from '@/modules/devices/domain/entities/device.validator';
import { ControllerFactory } from '@/core/base/infrastructure/factory.controller';
import { OtelInstanceCounter } from 'nestjs-otel';

@ApiTags('Device')
@OtelInstanceCounter()
@Controller('device')
export class DeviceController extends ControllerFactory<
  UpsertDeviceValidator,
  CreateDeviceValidator,
  GetDeviceParamsValidator,
  UpdateDeviceValidator,
  UpdateDeviceParamsValidator,
  DeleteDeviceBatchBodyValidator,
  DeleteDeviceParamsValidator
>(
  'device',
  'device',
  FilterPaginationDeviceQueryValidator,
  FilterCursorDeviceQueryValidator,
  ListDeviceSerializer,
  ListPaginationDeviceQueryValidator,
  ListCursorDeviceQueryValidator,
  UpsertDeviceSerializer,
  UpsertDeviceValidator,
  CreateDeviceSerializer,
  CreateDeviceValidator,
  GetDeviceSerializer,
  GetDeviceParamsValidator,
  UpdateDeviceSerializer,
  UpdateDeviceValidator,
  UpdateDeviceParamsValidator,
  DeleteDeviceSerializer,
  DeleteDeviceBatchBodyValidator,
  DeleteDeviceParamsValidator,
) {
  constructor(public _usecase: DeviceUseCase) {
    super();
  }
}
