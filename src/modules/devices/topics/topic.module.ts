import { Module } from '@nestjs/common';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

@Module({
  providers: [TopicService],
  controllers: [TopicController],
  exports: [TopicService],
})
export class TopicModule {}
