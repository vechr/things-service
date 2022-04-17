import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateTopicDto } from "./dto/create-topic.dto";
import { EditTopicDto } from "./dto/edit-topic.dto";
import { TopicService } from "./topic.service";

@ApiTags('Topic')
@Controller('device/:deviceId/topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}
  
  @Get()
  getTopics(@Param('deviceId') deviceId: string) {
    return this.topicService.getTopics(deviceId);
  }

  @Get(':id')
  getTopicById(@Param('id') topicId: string) {
    return this.topicService.getTopicById(topicId);
  }

  @Post()
  createTopic(@Param('deviceId') deviceId: string, @Body() dto: CreateTopicDto) {
    return this.topicService.createTopic(deviceId, dto);
  }

  @Patch(':id')
  editTopicById(@Param('deviceId') deviceId: string, @Param('id') topicId: string, @Body() dto: EditTopicDto) {
    return this.topicService.editTopicById(deviceId, topicId, dto);
  }

  @Delete(':id')
  deleteTopicById(@Param('id') topicId: string) {
    return this.topicService.deleteTopicById(topicId);
  }
}