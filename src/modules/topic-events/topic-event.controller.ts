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
import { ApiParam, ApiTags } from '@nestjs/swagger';
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

@ApiTags('TopicEvent')
@Controller('topic/:topicId/topic-events')
export class TopicEventController {
  constructor(private readonly topicEventService: TopicEventService) {}

  @Get('pagination')
  @HttpCode(HttpStatus.OK)
  @UseList()
  @Validator(ListTopicEventValidator)
  @Serializer(ListTopicEventResponse)
  @ApiFilterQuery('filters', ListTopicEventQueryValidator)
  @ApiParam({
    name: 'topicId',
    example: '6af7cc7b-c121-437d-a694-d9b685521661',
    type: String,
  })
  public async list(@Context() ctx: IContext): Promise<SuccessResponse> {
    const { result, meta } = await this.topicEventService.list(ctx);
    return new SuccessResponse('Success get all records!', result, meta);
  }

  @UseFilters(new ExceptionFilter())
  @EventPattern('notification.email.deleted')
  public async updateNotificationEmailInTopicEvent(
    @Payload() data: NotificationEmailDto,
  ): Promise<void> {
    await this.topicEventService.syncronizationNotificationEmailTopicEvent(
      data,
    );
  }

  @Get()
  public async getTopicEvents(
    @Param('topicId') topicId: string,
  ): Promise<SuccessResponse> {
    const result = await this.topicEventService.getTopicEvents(topicId);
    return new SuccessResponse('Success get all records!', result);
  }

  @Get(':id')
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
  public async createTopicEvent(
    @Param('topicId') topicId: string,
    @Body() dto: CreateTopicEventDto,
  ): Promise<SuccessResponse> {
    const result = await this.topicEventService.createTopicEvent(topicId, dto);
    return new SuccessResponse(`Success Create Topic Event!`, result);
  }

  @Patch(':id')
  public async editTopicEventById(
    @Param('topicId') topicId: string,
    @Param('id') topicEventId: string,
    @Body() dto: EditTopicEventDto,
  ): Promise<SuccessResponse> {
    const result = await this.topicEventService.editTopicEventById(
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
  public async deleteTopicEventById(
    @Param('id') topicEventId: string,
  ): Promise<SuccessResponse> {
    const result = await this.topicEventService.deleteTopicEventById(
      topicEventId,
    );
    return new SuccessResponse(
      `Topic Event: ${result.name} success deleted!`,
      result,
    );
  }
}
