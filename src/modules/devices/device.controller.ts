import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { EditDeviceDto } from './dto/edit-device.dto';
import ListDeviceValidator, {
  ListDeviceQueryValidator,
} from './validators/list-device.validator';
import ListDeviceResponse from './serializers/list-device.response';
import SuccessResponse from '@/shared/responses/success.response';
import UseList from '@/shared/decorators/uselist.decorator';
import Validator from '@/shared/decorators/validator.decorator';
import Serializer from '@/shared/decorators/serializer.decorator';
import { ApiFilterQuery } from '@/shared/decorators/api-filter-query.decorator';
import Context from '@/shared/decorators/context.decorator';
import { IContext } from '@/shared/interceptors/context.interceptor';

@ApiTags('Device')
@Controller('device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Get('pagination')
  @HttpCode(HttpStatus.OK)
  @UseList()
  @Validator(ListDeviceValidator)
  @Serializer(ListDeviceResponse)
  @ApiFilterQuery('filters', ListDeviceQueryValidator)
  public async list(@Context() ctx: IContext): Promise<SuccessResponse> {
    const { result, meta } = await this.deviceService.list(ctx);
    return new SuccessResponse('Success get all records!', result, meta);
  }

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
