import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { EditDeviceDto } from './dto/edit-device.dto';

@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  getDevices() {
    return this.deviceService.getDevices();
  }

  @Get(':id')
  getDeviceById(@Param('id') deviceId: string) {
    return this.deviceService.getDeviceById(deviceId);
  }

  @Post()
  createDevice(@Body() dto: CreateDeviceDto) {
    return this.deviceService.createDevice(dto);
  }

  @Patch(':id')
  editDeviceById(@Param('id') deviceId: string, @Body() dto: EditDeviceDto) {
    return this.deviceService.editDeviceById(deviceId, dto);
  }

  @Delete(':id')
  deleteDeviceById(@Param('id') deviceId: string) {
    return this.deviceService.deleteDeviceById(deviceId);
  }
}
