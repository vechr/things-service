import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateTopicEventDto } from "./dto/create-topic-event.dto";
import { EditTopicEventDto } from "./dto/edit-topic-event.dto";
import { GetTopicEventsDto } from "./dto/get-topic-events.dto";
import { TopicEventService } from "./topic-event.service";

@Controller('topic-events')
export class TopicEventController {
  constructor(private readonly topicEventService: TopicEventService){}

  @Get()
  getTopicEvents(@Body() dto: GetTopicEventsDto) {
    return this.topicEventService.getTopicEvents(dto.topicId);
  }

  @Get(':id')
  getTopicEventById(@Param('id') topicEventId: string) {
    return this.topicEventService.getTopicEventById(topicEventId);
  }

  @Post()
  createTopicEvent(@Body() dto: CreateTopicEventDto) {
    return this.topicEventService.createTopicEvent(dto);
  }

  @Patch(':id')
  editTopicEventById(@Param('id') topicEventId: string, @Body() dto: EditTopicEventDto) {
    return this.topicEventService.editTopicEventById(topicEventId, dto);
  }

  @Delete(':id')
  deleteTopicEventById(@Param('id') topicEventId: string) {
    return this.topicEventService.deleteTopicEventById(topicEventId);
  }
}