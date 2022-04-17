import SuccessResponse from "@/shared/responses/success.response";
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
  public async getTopics(@Param('deviceId') deviceId: string): Promise<SuccessResponse> {
    const result = await this.topicService.getTopics(deviceId);
    return new SuccessResponse('Success get all records!', result); 
  }

  @Get(':id')
  public async getTopicById(@Param('id') topicId: string): Promise<SuccessResponse> {
    const result = await this.topicService.getTopicById(topicId);
    return new SuccessResponse(`Success get Topic ${topicId}!`, result);
  }

  @Post()
  public async createTopic(@Param('deviceId') deviceId: string, @Body() dto: CreateTopicDto) {
    const result = await this.topicService.createTopic(deviceId, dto);
    return new SuccessResponse(`Success Create Topic!`, result);
  }

  @Patch(':id')
  public async editTopicById(@Param('deviceId') deviceId: string, @Param('id') topicId: string, @Body() dto: EditTopicDto): Promise<SuccessResponse> {
    const result = await this.topicService.editTopicById(deviceId, topicId, dto);
    return new SuccessResponse(`Success update Topic ${topicId}!`, result);
  }

  @Delete(':id')
  public async deleteTopicById(@Param('id') topicId: string): Promise<SuccessResponse> {
    const result = await this.topicService.deleteTopicById(topicId);
    return new SuccessResponse(`Topic: ${topicId} success deleted!`, result);
  }
}