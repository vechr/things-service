import { NatsService } from '@/modules/services/nats.service';
import PrismaService from '@/prisma/prisma.service';
import { UnknownException } from '@/shared/exceptions/common.exception';
import log from '@/shared/utils/log.util';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { TopicEvent } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { CreateTopicEventDto } from './dto/create-topic-event.dto';
import { EditTopicEventDto } from './dto/edit-topic-event.dto';

@Injectable()
export class TopicEventService {
  constructor(private readonly prisma: PrismaService) {}

  async getTopicEvents(topicId: string): Promise<TopicEvent[]> {
    try {
      const result = await this.prisma.topicEvent.findMany({
        where: {
          topicId,
        },
      });

      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  async getTopicEventById(topicEventId: string): Promise<TopicEvent> {
    try {
      const topicEvent = await this.prisma.topicEvent.findUnique({
        where: {
          id: topicEventId,
        },
      });

      if (!topicEvent) {
        throw new NotFoundException({
          code: HttpStatus.NOT_FOUND.toString(),
          message: 'Topic Event is not found!',
        });
      }

      return topicEvent;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  async createTopicEvent(
    topicId,
    {
      name,
      description,
      eventExpression,
      bodyEmail,
      htmlBodyEmail,
      notificationEmailId,
    }: CreateTopicEventDto,
  ): Promise<TopicEvent> {
    try {
      const topic = await this.prisma.topic.findUnique({
        where: {
          id: topicId,
        },
        include: {
          topicEvents: true,
        },
      });

      if (!topic) {
        throw new NotFoundException({
          code: HttpStatus.NOT_FOUND.toString(),
          message: 'Topic is not found!',
        });
      }

      const topicEvent = await this.prisma.topicEvent.create({
        data: {
          name,
          description,
          eventExpression,
          topicId,
          bodyEmail,
          htmlBodyEmail,
          notificationEmailId,
        },
      });

      const topicUpdated = await this.prisma.topic.findUnique({
        where: {
          id: topicId,
        },
        include: {
          topicEvents: true,
        },
      });

      await NatsService.kv.put(
        topic.id,
        NatsService.sc.encode(JSON.stringify(topicUpdated)),
      );

      return topicEvent;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  async editTopicEventById(
    topicId: string,
    topicEventId: string,
    {
      name,
      description,
      eventExpression,
      bodyEmail,
      htmlBodyEmail,
      notificationEmailId,
    }: EditTopicEventDto,
  ): Promise<TopicEvent> {
    try {
      const topicEvent = await this.prisma.topicEvent.findUnique({
        where: {
          id: topicEventId,
        },
      });

      if (!topicEvent) {
        throw new NotFoundException({
          code: HttpStatus.NOT_FOUND.toString(),
          message: 'Topic Event is not found!',
        });
      }

      const topic = await this.prisma.topic.findUnique({
        where: {
          id: topicId,
        },
        include: {
          topicEvents: true,
        },
      });

      if (!topic) {
        throw new NotFoundException({
          code: HttpStatus.NOT_FOUND.toString(),
          message: 'Topic is not found!',
        });
      }

      const result = await this.prisma.topicEvent.update({
        where: {
          id: topicEventId,
        },
        data: {
          name,
          description,
          eventExpression,
          topicId,
          bodyEmail,
          htmlBodyEmail,
          notificationEmailId,
        },
      });

      const topicUpdated = await this.prisma.topic.findUnique({
        where: {
          id: topicId,
        },
        include: {
          topicEvents: true,
        },
      });

      await NatsService.kv.put(
        topic.id,
        NatsService.sc.encode(JSON.stringify(topicUpdated)),
      );
      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  async deleteTopicEventById(topicEventId: string): Promise<TopicEvent> {
    try {
      const topicEvent = await this.prisma.topicEvent.findUnique({
        where: {
          id: topicEventId,
        },
      });

      if (!topicEvent) {
        throw new NotFoundException({
          code: HttpStatus.NOT_FOUND.toString(),
          message: 'Topic Event is not found!',
        });
      }

      const topic = await this.prisma.topic.findUnique({
        where: {
          id: topicEvent.topicId,
        },
        include: {
          topicEvents: true,
        },
      });

      if (!topic) {
        throw new NotFoundException({
          code: HttpStatus.NOT_FOUND.toString(),
          message: 'Topic is not found!',
        });
      }

      const result = await this.prisma.topicEvent.delete({
        where: {
          id: topicEventId,
        },
      });

      await NatsService.kv.put(
        topic.id,
        NatsService.sc.encode(JSON.stringify(topic)),
      );

      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
}
