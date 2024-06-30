import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TopicUseCase } from '../domain/usecase/topic.usecase';
import {
  CreateTopicSerializer,
  DeleteTopicSerializer,
  GetTopicSerializer,
  ListTopicSerializer,
  UpdateTopicSerializer,
  UpsertTopicSerializer,
} from '@/modules/topics/domain/entities/topic.serializer';
import {
  CreateTopicValidator,
  DBLoggerRequestValidator,
  DeleteTopicBatchBodyValidator,
  DeleteTopicParamsValidator,
  FilterCursorTopicQueryValidator,
  FilterPaginationTopicQueryValidator,
  GetTopicParamsValidator,
  ListCursorTopicQueryValidator,
  ListPaginationTopicQueryValidator,
  UpdateTopicParamsValidator,
  UpdateTopicValidator,
  UpsertTopicValidator,
} from '@/modules/topics/domain/entities/topic.validator';
import { ControllerFactory } from '@/core/base/infrastructure/factory.controller';
import { OtelInstanceCounter } from 'nestjs-otel';
import Authentication from '@/core/base/frameworks/shared/decorators/authentication.decorator';
import Authorization from '@/core/base/frameworks/shared/decorators/authorization.decorator';
import SuccessResponse from '@/core/base/frameworks/shared/responses/success.response';
import { TopicUseCaseNATS } from '../domain/usecase/topic-nats.usecase';

@ApiTags('Topic')
@OtelInstanceCounter()
@Controller('topic')
export class TopicController extends ControllerFactory<
  UpsertTopicValidator,
  CreateTopicValidator,
  GetTopicParamsValidator,
  UpdateTopicValidator,
  UpdateTopicParamsValidator,
  DeleteTopicBatchBodyValidator,
  DeleteTopicParamsValidator
>(
  'topic',
  'topic',
  FilterPaginationTopicQueryValidator,
  FilterCursorTopicQueryValidator,
  ListTopicSerializer,
  ListPaginationTopicQueryValidator,
  ListCursorTopicQueryValidator,
  UpsertTopicSerializer,
  UpsertTopicValidator,
  CreateTopicSerializer,
  CreateTopicValidator,
  GetTopicSerializer,
  GetTopicParamsValidator,
  UpdateTopicSerializer,
  UpdateTopicValidator,
  UpdateTopicParamsValidator,
  DeleteTopicSerializer,
  DeleteTopicBatchBodyValidator,
  DeleteTopicParamsValidator,
) {
  constructor(
    public _usecase: TopicUseCase,
    public _usecaseNATS: TopicUseCaseNATS,
  ) {
    super();
  }

  @ApiOperation({
    summary: 'this API is used to query data from database (influxdb)',
  })
  @ApiResponse({ status: 200, description: '[<your data in here>]' })
  @HttpCode(HttpStatus.OK)
  @Post('query')
  @Authentication(true)
  @Authorization('topic:read@auth')
  @ApiBody({ type: DBLoggerRequestValidator })
  async getDataTopic(
    @Body() body: DBLoggerRequestValidator,
  ): Promise<SuccessResponse<any>> {
    const result = await this._usecaseNATS.getDataTopic(body);
    return new SuccessResponse('Success get record all data Topic!', result);
  }
}
