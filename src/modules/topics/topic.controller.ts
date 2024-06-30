// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   HttpCode,
//   HttpStatus,
//   Param,
//   Patch,
//   Post,
//   UseFilters,
//   Version,
// } from '@nestjs/common';
// import { EventPattern, Payload } from '@nestjs/microservices';
// import {
//   ApiBearerAuth,
//   ApiOperation,
//   ApiParam,
//   ApiResponse,
//   ApiTags,
// } from '@nestjs/swagger';
// import { OtelInstanceCounter, OtelMethodCounter } from 'nestjs-otel';
// import {
//   CreateTopicDto,
//   DBLoggerDto,
//   EditTopicDto,
//   TopicIdRequestDto,
// } from './dto';
// import { TopicService } from './topic.service';
// import ListTopicValidator, {
//   ListTopicQueryValidator,
// } from './validators/list-topic.validator';
// import ListTopicResponse from './serializers/list.topic.response';
// import SuccessResponse from '@/shared/responses/success.response';
// import { ExceptionFilter } from '@/shared/filters/rpc-exception.filter';
// import UseList from '@/shared/decorators/uselist.decorator';
// import Validator from '@/shared/decorators/validator.decorator';
// import Serializer from '@/shared/decorators/serializer.decorator';
// import { ApiFilterQuery } from '@/shared/decorators/api-filter-query.decorator';
// import Context from '@/shared/decorators/context.decorator';
// import { IContext } from '@/shared/interceptors/context.interceptor';
// import Authentication from '@/shared/decorators/authentication.decorator';
// import Authorization from '@/shared/decorators/authorization.decorator';

// @ApiTags('Topic')
// @ApiBearerAuth('access-token')
// @Controller('things/device/:deviceId/topic')
// @OtelInstanceCounter()
// export class TopicController {
//   constructor(private readonly topicService: TopicService) {}

//   @Version('2')
//   @Get()
//   @HttpCode(HttpStatus.OK)
//   @UseList()
//   @Authentication(true)
//   @Authorization('topics:read@auth')
//   @Validator(ListTopicValidator)
//   @Serializer(ListTopicResponse)
//   @ApiFilterQuery('filters', ListTopicQueryValidator)
//   @ApiParam({
//     name: 'deviceId',
//     example: 'f24ec74b-8716-4fc5-b60a-e4cd62967f47',
//     type: String,
//   })
//   @OtelMethodCounter()
//   public async list(@Context() ctx: IContext): Promise<SuccessResponse> {
//     const { result, meta } = await this.topicService.list(ctx);
//     return new SuccessResponse('Success get all records!', result, meta);
//   }

//   @UseFilters(new ExceptionFilter())
//   @EventPattern('set.topic.widget.kv')
//   @OtelMethodCounter()
//   async getTopicWidget(
//     @Payload() { topicId }: TopicIdRequestDto,
//   ): Promise<void> {
//     await this.topicService.getTopicWidget(topicId);
//   }

//   @ApiOperation({
//     summary: 'this API is used to query data from database (influxdb)',
//   })
//   @ApiResponse({ status: 200, description: '[<your data in here>]' })
//   @HttpCode(HttpStatus.OK)
//   @Post('query')
//   @Authentication(true)
//   @Authorization('topics:read@auth')
//   @OtelMethodCounter()
//   async getDataTopic(@Body() dto: DBLoggerDto): Promise<SuccessResponse<any>> {
//     const result = await this.topicService.getDataTopic(dto);
//     return new SuccessResponse('Success get record all data Topic!', result);
//   }

//   @Get()
//   @Authentication(true)
//   @Authorization('topics:read@auth')
//   @OtelMethodCounter()
//   public async getTopics(
//     @Param('deviceId') deviceId: string,
//   ): Promise<SuccessResponse> {
//     const result = await this.topicService.getTopics(deviceId);
//     return new SuccessResponse('Success get all records!', result);
//   }

//   @Get(':id')
//   @Authentication(true)
//   @Authorization('topics:read@auth')
//   @OtelMethodCounter()
//   public async getTopicById(
//     @Param('id') topicId: string,
//   ): Promise<SuccessResponse> {
//     const result = await this.topicService.getTopicById(topicId);
//     return new SuccessResponse(`Success get Topic ${result.name}!`, result);
//   }

//   @Post()
//   @Authentication(true)
//   @Authorization('topics:create@auth')
//   @OtelMethodCounter()
//   public async createTopic(
//     @Context() ctx: IContext,
//     @Param('deviceId') deviceId: string,
//     @Body() dto: CreateTopicDto,
//   ) {
//     const result = await this.topicService.createTopic(ctx, deviceId, dto);
//     return new SuccessResponse(`Success Create Topic!`, result);
//   }

//   @Patch(':id')
//   @Authentication(true)
//   @Authorization('topics:update@auth')
//   @OtelMethodCounter()
//   public async editTopicById(
//     @Context() ctx: IContext,
//     @Param('deviceId') deviceId: string,
//     @Param('id') topicId: string,
//     @Body() dto: EditTopicDto,
//   ): Promise<SuccessResponse> {
//     const result = await this.topicService.editTopicById(
//       ctx,
//       deviceId,
//       topicId,
//       dto,
//     );
//     return new SuccessResponse(`Success update Topic ${result.name}!`, result);
//   }

//   @Delete(':id')
//   @Authentication(true)
//   @Authorization('topics:delete@auth')
//   @OtelMethodCounter()
//   public async deleteTopicById(
//     @Context() ctx: IContext,
//     @Param('id') topicId: string,
//   ): Promise<SuccessResponse> {
//     const result = await this.topicService.deleteTopicById(ctx, topicId);
//     return new SuccessResponse(
//       `Topic: ${result.name} success deleted!`,
//       result,
//     );
//   }
// }
