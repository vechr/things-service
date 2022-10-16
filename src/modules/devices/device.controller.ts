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
  Version,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
import Authentication from '@/shared/decorators/authentication.decorator';
import Authorization from '@/shared/decorators/authorization.decorator';

@ApiTags('Device')
@ApiBearerAuth('access-token')
@Controller('things/device')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Version('2')
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseList()
  @Authentication(true)
  @Authorization('devices:read@auth')
  @Validator(ListDeviceValidator)
  @Serializer(ListDeviceResponse)
  @ApiFilterQuery('filters', ListDeviceQueryValidator)
  public async list(@Context() ctx: IContext): Promise<SuccessResponse> {
    const { result, meta } = await this.deviceService.list(ctx);
    return new SuccessResponse('Success get all records!', result, meta);
  }

  @Get()
  @Authentication(true)
  @Authorization('devices:read@auth')
  public async getDevices(): Promise<SuccessResponse> {
    const result = await this.deviceService.getDevices();
    return new SuccessResponse('Success get all records!', result);
  }

  @Get(':id')
  @Authentication(true)
  @Authorization('devices:read@auth')
  public async getDeviceById(@Param('id') deviceId: string) {
    const result = await this.deviceService.getDeviceById(deviceId);
    return new SuccessResponse(`Success get Device ${result.name}!`, result);
  }

  @Post()
  @Authentication(true)
  @Authorization('devices:create@auth')
  public async createDevice(
    @Body() dto: CreateDeviceDto,
  ): Promise<SuccessResponse> {
    const result = await this.deviceService.createDevice(dto);
    return new SuccessResponse(`Success Create Device!`, result);
  }

  @Patch(':id')
  @Authentication(true)
  @Authorization('devices:update@auth')
  public async editDeviceById(
    @Param('id') deviceId: string,
    @Body() dto: EditDeviceDto,
  ): Promise<SuccessResponse> {
    const result = await this.deviceService.editDeviceById(deviceId, dto);
    return new SuccessResponse(`Success update Device ${result.name}!`, result);
  }

  @Delete(':id')
  @Authentication(true)
  @Authorization('devices:delete@auth')
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
