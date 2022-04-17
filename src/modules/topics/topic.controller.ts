import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { EditTopicDto } from "./dto/edit-topic.dto";
import { GetTopicsDto } from "./dto/get-topics.dto";
import { TopicService } from "./topic.service";

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}
  
  @Get()
  getTopics(@Body() { deviceId }: GetTopicsDto) {
    return this.topicService.getTopics(deviceId);
  }

  @Get(':id')
  getTopicById(@Param('id') topicId: string) {
    return this.topicService.getTopicById(topicId);
  }

  @Post()
  createTopic(@Body() dto: CreateTopicDto) {
    return this.topicService.createTopic(dto);
  }

  @Patch(':id')
  editTopicById(@Param('id') topicId: string, @Body() dto: EditTopicDto) {
    return this.topicService.editTopicById(topicId, dto);
  }

  @Delete(':id')
  deleteTopicById(@Param('id') topicId: string) {
    return this.topicService.deleteTopicById(topicId);
  }
}