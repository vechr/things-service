import { Module } from '@nestjs/common';
import { TopicEventController } from './topic-event.controller';
import { TopicEventService } from './topic-event.service';

@Module({
  providers: [TopicEventService],
  controllers: [TopicEventController],
  exports: [TopicEventService],
})
export class TopicEventModule {}
