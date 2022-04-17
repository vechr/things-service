import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateTopicEventDto } from "./dto/create-topic-event.dto";
import { EditTopicEventDto } from "./dto/edit-topic-event.dto";
import { TopicEventService } from "./topic-event.service";

@ApiTags('Topic Event')
@Controller('topic/:topicId/topic-events')
export class TopicEventController {
  constructor(private readonly topicEventService: TopicEventService){}

  @Get()
  getTopicEvents(@Param('topicId') topicId: string) {
    return this.topicEventService.getTopicEvents(topicId);
  }

  @Get(':id')
  getTopicEventById(@Param('id') topicEventId: string) {
    return this.topicEventService.getTopicEventById(topicEventId);
  }

  @Post()
  createTopicEvent(@Param('topicId') topicId: string, @Body() dto: CreateTopicEventDto) {
    return this.topicEventService.createTopicEvent(topicId, dto);
  }

  @Patch(':id')
  editTopicEventById(@Param('topicId') topicId: string, @Param('id') topicEventId: string, @Body() dto: EditTopicEventDto) {
    return this.topicEventService.editTopicEventById(topicId, topicEventId, dto);
  }

  @Delete(':id')
  deleteTopicEventById(@Param('id') topicEventId: string) {
    return this.topicEventService.deleteTopicEventById(topicEventId);
  }
}