import { NatsService } from '@/modules/services/nats.service';
import { ExceptionFilter } from '@/shared/filters/rpc-exception.filter';
import SuccessResponse from '@/shared/responses/success.response';
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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTopicDto, DBLoggerDto, EditTopicDto } from './dto';
import { TopicIdRequestDto } from './dto/topic-id-request.dto';
import { TopicService } from './topic.service';

@ApiTags('Topic')
@Controller('device/:deviceId/topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

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
