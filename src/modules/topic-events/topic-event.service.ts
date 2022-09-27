import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { TopicEvent } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { CreateTopicEventDto } from './dto/create-topic-event.dto';
import { EditTopicEventDto } from './dto/edit-topic-event.dto';
import { NotificationEmailDto } from './dto/notification-email-event.dto';
import { IListTopicEventRequestQuery } from './requests/list-topic-event.request';
import log from '@/shared/utils/log.util';
import { UnknownException } from '@/shared/exceptions/common.exception';
import PrismaService from '@/prisma/prisma.service';
import { NatsService } from '@/modules/services/nats.service';
import { IContext } from '@/shared/interceptors/context.interceptor';
import { parseMeta, parseQuery } from '@/shared/utils/query.util';

@Injectable()
export class TopicEventService {
  constructor(private readonly prisma: PrismaService) {}

  async list(ctx: IContext): Promise<{
    result: TopicEvent[];
    meta: { count: number; total: number; page: number; totalPage: number };
  }> {
    const query = ctx.params.query as IListTopicEventRequestQuery;

    const { limit, offset, order, page } =
      parseQuery<IListTopicEventRequestQuery>(query);

    const selectOptions = {
      orderBy: order,
      where: query.filters.field,
    };

    const pageOptions = {
      take: limit,
      skip: offset,
    };

    const [total, topicEvent] = await this.prisma.$transaction([
      this.prisma.topicEvent.count(selectOptions),
      this.prisma.topicEvent.findMany({ ...pageOptions, ...selectOptions }),
    ]);

    const meta = parseMeta<TopicEvent>({
      result: topicEvent,
      total,
      page,
      limit,
    });

    return {
      result: topicEvent,
      meta,
    };
  }

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

  async syncronizationNotificationEmailTopicEvent(dto: NotificationEmailDto) {
    try {
      const search = await this.prisma.topicEvent.findMany({
        where: {
          notificationEmailId: {
            has: dto.id,
          },
        },
      });

      search.forEach(async (item) => {
        await this.prisma.topicEvent.update({
          where: {
            id: item.id,
          },
          data: {
            notificationEmailId: {
              set: item.notificationEmailId.filter((id) => id !== dto.id),
            },
          },
        });
      });
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
