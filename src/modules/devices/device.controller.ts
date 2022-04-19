import SuccessResponse from '@/shared/responses/success.response';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { EditDeviceDto } from './dto/edit-device.dto';

@ApiTags('Device')
@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get()
  public async getDevices(): Promise<SuccessResponse> {
    const result = await this.deviceService.getDevices();
    return new SuccessResponse('Success get all records!', result);
  }

  @Get(':id')
  public async getDeviceById(@Param('id') deviceId: string) {
    const result = await this.deviceService.getDeviceById(deviceId);
    return new SuccessResponse(`Success get Device ${result.name}!`, result);
  }

  @Post()
  public async createDevice(
    @Body() dto: CreateDeviceDto,
  ): Promise<SuccessResponse> {
    const result = await this.deviceService.createDevice(dto);
    return new SuccessResponse(`Success Create Device!`, result);
  }

  @Patch(':id')
  public async editDeviceById(
    @Param('id') deviceId: string,
    @Body() dto: EditDeviceDto,
  ): Promise<SuccessResponse> {
    const result = await this.deviceService.editDeviceById(deviceId, dto);
    return new SuccessResponse(`Success update Device ${result.name}!`, result);
  }

  @Delete(':id')
  public async deleteDeviceById(
    @Param('id') deviceId: string,
  ): Promise<SuccessResponse> {
    const result = await this.deviceService.deleteDeviceById(deviceId);
    return new SuccessResponse(
      `Device: ${result.name} success deleted!`,
      result,
    );
  }
}
