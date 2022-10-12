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
import { DeviceTypeService } from './device-type.service';
import { CreateDeviceTypeDto } from './dto/create-device-type.dto';
import { EditDeviceTypeDto } from './dto/edit-device-type.dto';
import ListDeviceTypeValidator, {
  ListDeviceTypeQueryValidator,
} from './validators/list-device-type.validator';
import ListDeviceTypeResponse from './serializers/list-device-type.response';
import SuccessResponse from '@/shared/responses/success.response';
import UseList from '@/shared/decorators/uselist.decorator';
import Validator from '@/shared/decorators/validator.decorator';
import Serializer from '@/shared/decorators/serializer.decorator';
import { ApiFilterQuery } from '@/shared/decorators/api-filter-query.decorator';
import Context from '@/shared/decorators/context.decorator';
import { IContext } from '@/shared/interceptors/context.interceptor';
import Authentication from '@/shared/decorators/authentication.decorator';
import Authorization from '@/shared/decorators/authorization.decorator';

@ApiTags('DeviceType')
@ApiBearerAuth('access-token')
@Controller('things/device-type')
export class DeviceTypeController {
  constructor(private readonly deviceTypeService: DeviceTypeService) {}

  @Version('2')
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseList()
  @Authentication(true)
  @Authorization('device-types:read@auth')
  @Validator(ListDeviceTypeValidator)
  @Serializer(ListDeviceTypeResponse)
  @ApiFilterQuery('filters', ListDeviceTypeQueryValidator)
  public async list(@Context() ctx: IContext): Promise<SuccessResponse> {
    const { result, meta } = await this.deviceTypeService.list(ctx);
    return new SuccessResponse('Success get all records!', result, meta);
  }

  @Get()
  @Authentication(true)
  @Authorization('device-types:read@auth')
  public async getDeviceTypes(): Promise<SuccessResponse> {
    const result = await this.deviceTypeService.getDeviceTypes();
    return new SuccessResponse('Success get all records!', result);
  }

  @Get(':id')
  @Authentication(true)
  @Authorization('device-types:read@auth')
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
  @Authentication(true)
  @Authorization('device-types:create@auth')
  public async createDeviceType(@Body() dto: CreateDeviceTypeDto) {
    const result = await this.deviceTypeService.createDeviceType(dto);
    return new SuccessResponse(`Success Create device type!`, result);
  }

  @Patch(':id')
  @Authentication(true)
  @Authorization('device-types:update@auth')
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
  @Authentication(true)
  @Authorization('device-types:delete@auth')
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
