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
  UseFilters,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateTopicDto,
  DBLoggerDto,
  EditTopicDto,
  TopicIdRequestDto,
} from './dto';
import { TopicService } from './topic.service';
import ListTopicValidator, {
  ListTopicQueryValidator,
} from './validators/list-topic.validator';
import ListTopicResponse from './serializers/list.topic.response';
import SuccessResponse from '@/shared/responses/success.response';
import { ExceptionFilter } from '@/shared/filters/rpc-exception.filter';
import { NatsService } from '@/modules/services/nats.service';
import UseList from '@/shared/decorators/uselist.decorator';
import Validator from '@/shared/decorators/validator.decorator';
import Serializer from '@/shared/decorators/serializer.decorator';
import { ApiFilterQuery } from '@/shared/decorators/api-filter-query.decorator';
import Context from '@/shared/decorators/context.decorator';
import { IContext } from '@/shared/interceptors/context.interceptor';

@ApiTags('Topic')
@Controller('device/:deviceId/topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get('pagination')
  @HttpCode(HttpStatus.OK)
  @UseList()
  @Validator(ListTopicValidator)
  @Serializer(ListTopicResponse)
  @ApiFilterQuery('filters', ListTopicQueryValidator)
  @ApiParam({
    name: 'deviceId',
    example: 'f24ec74b-8716-4fc5-b60a-e4cd62967f47',
    type: String,
  })
  public async list(@Context() ctx: IContext): Promise<SuccessResponse> {
    const { result, meta } = await this.topicService.list(ctx);
    return new SuccessResponse('Success get all records!', result, meta);
  }

  @UseFilters(new ExceptionFilter())
  @EventPattern('set.topic.widget.kv')
  async getTopicWidget(
    @Payload() { topicId }: TopicIdRequestDto,
  ): Promise<void> {
    const result = await this.topicService.getTopicById(topicId);
    await NatsService.kv.put(
      result.id,
      NatsService.sc.encode(JSON.stringify(result)),
    );
  }

  @ApiOperation({
    summary: 'this API is used to query data from database (influxdb)',
  })
  @ApiResponse({ status: 200, description: '[<your data in here>]' })
  @HttpCode(HttpStatus.OK)
  @Post('query')
  async getDataTopic(@Body() dto: DBLoggerDto): Promise<SuccessResponse<any>> {
    const result = await this.topicService.getDataTopic(dto);
    return new SuccessResponse('Success get record all data Topic!', result);
  }

  @Get()
  public async getTopics(
    @Param('deviceId') deviceId: string,
  ): Promise<SuccessResponse> {
    const result = await this.topicService.getTopics(deviceId);
    return new SuccessResponse('Success get all records!', result);
  }

  @Get(':id')
  public async getTopicById(
    @Param('id') topicId: string,
  ): Promise<SuccessResponse> {
    const result = await this.topicService.getTopicById(topicId);
    return new SuccessResponse(`Success get Topic ${result.name}!`, result);
  }

  @Post()
  public async createTopic(
    @Param('deviceId') deviceId: string,
    @Body() dto: CreateTopicDto,
  ) {
    const result = await this.topicService.createTopic(deviceId, dto);
    return new SuccessResponse(`Success Create Topic!`, result);
  }

  @Patch(':id')
  public async editTopicById(
    @Param('deviceId') deviceId: string,
    @Param('id') topicId: string,
    @Body() dto: EditTopicDto,
  ): Promise<SuccessResponse> {
    const result = await this.topicService.editTopicById(
      deviceId,
      topicId,
      dto,
    );
    return new SuccessResponse(`Success update Topic ${result.name}!`, result);
  }

  @Delete(':id')
  public async deleteTopicById(
    @Param('id') topicId: string,
  ): Promise<SuccessResponse> {
    const result = await this.topicService.deleteTopicById(topicId);
    return new SuccessResponse(
      `Topic: ${result.name} success deleted!`,
      result,
    );
  }
}
