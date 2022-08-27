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
import { CreateTopicEventDto, EditTopicEventDto } from './dto';
import { TopicEventService } from './topic-event.service';

@ApiTags('Topic Event')
@Controller('topic/:topicId/topic-events')
export class TopicEventController {
  constructor(private readonly topicEventService: TopicEventService) {}

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
