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
import { DeviceTypeService } from './device-type.service';
import { CreateDeviceTypeDto } from './dto/create-device-type.dto';
import { EditDeviceTypeDto } from './dto/edit-device-type.dto';

@ApiTags('Device Type')
@Controller('device-type')
export class DeviceTypeController {
  constructor(private readonly deviceTypeService: DeviceTypeService) {}

  @Get()
  public async getDeviceTypes(): Promise<SuccessResponse> {
    const result = await this.deviceTypeService.getDeviceTypes();
    return new SuccessResponse('Success get all records!', result);
  }

  @Get(':id')
  public async getDeviceTypeById(
    @Param('id') deviceTypeId: string,
  ): Promise<SuccessResponse> {
    const result = await this.deviceTypeService.getDeviceTypeById(deviceTypeId);
    return new SuccessResponse(
      `Success get device type ${result.name}!`,
      result,
    );
  }

  @Post()
  public async createDeviceType(@Body() dto: CreateDeviceTypeDto) {
    const result = await this.deviceTypeService.createDeviceType(dto);
    return new SuccessResponse(`Success Create device type!`, result);
  }

  @Patch(':id')
  public async editDeviceTypeById(
    @Param('id') deviceTypeId: string,
    @Body() dto: EditDeviceTypeDto,
  ): Promise<SuccessResponse> {
    const result = await this.deviceTypeService.editDeviceTypeById(
      deviceTypeId,
      dto,
    );
    return new SuccessResponse(
      `Success update device type ${result.name}!`,
      result,
    );
  }

  @Delete(':id')
  public async deleteDeviceTypeById(@Param('id') deviceTypeId: string) {
    const result = await this.deviceTypeService.deleteDeviceTypeById(
      deviceTypeId,
    );
    return new SuccessResponse(
      `Device Type: ${result.name} success deleted!`,
      result,
    );
  }
}
