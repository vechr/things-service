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
  Version,
} from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { OtelInstanceCounter, OtelMethodCounter } from 'nestjs-otel';
import { CreateTopicEventDto, EditTopicEventDto } from './dto';
import { NotificationEmailDto } from './dto/notification-email-event.dto';
import { TopicEventService } from './topic-event.service';
import ListTopicEventValidator, {
  ListTopicEventQueryValidator,
} from './validators/list-topic-event.validator';
import ListTopicEventResponse from './serializers/list-topic-event.response';
import SuccessResponse from '@/shared/responses/success.response';
import { ExceptionFilter } from '@/shared/filters/rpc-exception.filter';
import UseList from '@/shared/decorators/uselist.decorator';
import Validator from '@/shared/decorators/validator.decorator';
import Serializer from '@/shared/decorators/serializer.decorator';
import { ApiFilterQuery } from '@/shared/decorators/api-filter-query.decorator';
import Context from '@/shared/decorators/context.decorator';
import { IContext } from '@/shared/interceptors/context.interceptor';
import Authentication from '@/shared/decorators/authentication.decorator';
import Authorization from '@/shared/decorators/authorization.decorator';

@ApiTags('TopicEvent')
@ApiBearerAuth('access-token')
@Controller('things/topic/:topicId/topic-events')
@OtelInstanceCounter()
export class TopicEventController {
  constructor(private readonly topicEventService: TopicEventService) {}

  @Version('2')
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseList()
  @Authentication(true)
  @Authorization('topic-events:read@auth')
  @Validator(ListTopicEventValidator)
  @Serializer(ListTopicEventResponse)
  @ApiFilterQuery('filters', ListTopicEventQueryValidator)
  @ApiParam({
    name: 'topicId',
    example: '6af7cc7b-c121-437d-a694-d9b685521661',
    type: String,
  })
  @OtelMethodCounter()
  public async list(@Context() ctx: IContext): Promise<SuccessResponse> {
    const { result, meta } = await this.topicEventService.list(ctx);
    return new SuccessResponse('Success get all records!', result, meta);
  }

  @UseFilters(new ExceptionFilter())
  @EventPattern('notification.email.deleted')
  @OtelMethodCounter()
  public async updateNotificationEmailInTopicEvent(
    @Payload() data: NotificationEmailDto,
  ): Promise<void> {
    await this.topicEventService.syncronizationNotificationEmailTopicEvent(
      data,
    );
  }

  @Get()
  @Authentication(true)
  @Authorization('topic-events:read@auth')
  @OtelMethodCounter()
  public async getTopicEvents(
    @Param('topicId') topicId: string,
  ): Promise<SuccessResponse> {
    const result = await this.topicEventService.getTopicEvents(topicId);
    return new SuccessResponse('Success get all records!', result);
  }

  @Get(':id')
  @Authentication(true)
  @Authorization('topic-events:read@auth')
  @OtelMethodCounter()
  public async getTopicEventById(
    @Param('id') topicEventId: string,
  ): Promise<SuccessResponse> {
    const result = await this.topicEventService.getTopicEventById(topicEventId);
    return new SuccessResponse(
      `Success get Topic Event ${result.name}!`,
      result,
    );
  }

  @Post()
  @Authentication(true)
  @Authorization('topic-events:create@auth')
  @OtelMethodCounter()
  public async createTopicEvent(
    @Context() ctx: IContext,
    @Param('topicId') topicId: string,
    @Body() dto: CreateTopicEventDto,
  ): Promise<SuccessResponse> {
    const result = await this.topicEventService.createTopicEvent(
      ctx,
      topicId,
      dto,
    );
    return new SuccessResponse(`Success Create Topic Event!`, result);
  }

  @Patch(':id')
  @Authentication(true)
  @Authorization('topic-events:update@auth')
  @OtelMethodCounter()
  public async editTopicEventById(
    @Context() ctx: IContext,
    @Param('topicId') topicId: string,
    @Param('id') topicEventId: string,
    @Body() dto: EditTopicEventDto,
  ): Promise<SuccessResponse> {
    const result = await this.topicEventService.editTopicEventById(
      ctx,
      topicId,
      topicEventId,
      dto,
    );
    return new SuccessResponse(
      `Success update Topic Event ${result.name}!`,
      result,
    );
  }

  @Delete(':id')
  @Authentication(true)
  @Authorization('topic-events:delete@auth')
  @OtelMethodCounter()
  public async deleteTopicEventById(
    @Context() ctx: IContext,
    @Param('id') topicEventId: string,
  ): Promise<SuccessResponse> {
    const result = await this.topicEventService.deleteTopicEventById(
      ctx,
      topicEventId,
    );
    return new SuccessResponse(
      `Topic Event: ${result.name} success deleted!`,
      result,
    );
  }
}
