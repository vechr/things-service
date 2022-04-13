import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DeviceTypeService } from './device-type.service';
import { CreateDeviceTypeDto } from './dto/create-device-type.dto';
import { EditDeviceTypeDto } from './dto/edit-device-type.dto';

@Controller('device-type')
export class DeviceTypeController {
  constructor(private readonly deviceTypeService: DeviceTypeService) {}

  @Get()
  getDeviceTypes() {
    return this.deviceTypeService.getDeviceTypes();
  }

  @Get(':id')
  getDeviceTypeById(@Param('id') deviceTypeId: string) {
    return this.deviceTypeService.getDeviceTypeById(deviceTypeId);
  }

  @Post()
  createDeviceType(@Body() dto: CreateDeviceTypeDto) {
    return this.deviceTypeService.createDeviceType(dto);
  }

  @Patch(':id')
  editDeviceTypeById(
    @Param('id') deviceTypeId: string,
    @Body() dto: EditDeviceTypeDto,
  ) {
    return this.deviceTypeService.editDeviceTypeById(deviceTypeId, dto);
  }

  @Delete(':id')
  deleteDeviceTypeById(@Param('id') deviceTypeId: string) {
    return this.deviceTypeService.deleteDeviceTypeById(deviceTypeId);
  }
}
