import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { TopicEvent } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { StringCodec } from 'nats';
import { NatsjsSubscriber } from '../services/natsjs/natsjs.subscriber';
import AuditService from '../audits/audit.service';
import { AuditAction } from '../audits/types/audit-enum.type';
import { CreateTopicEventDto } from './dto/create-topic-event.dto';
import { EditTopicEventDto } from './dto/edit-topic-event.dto';
import { NotificationEmailDto } from './dto/notification-email-event.dto';
import {
  TListTopicEventRequestQuery,
  TTopicEventRequestParams,
} from './requests/list-topic-event.request';
import log from '@/shared/utils/log.util';
import { UnknownException } from '@/shared/exceptions/common.exception';
import PrismaService from '@/prisma/prisma.service';
import { IContext } from '@/shared/interceptors/context.interceptor';
import { parseMeta, parseQuery } from '@/shared/utils/query.util';
import { Auditable } from '@/shared/types/auditable.type';

@Injectable()
export class TopicEventService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly natsjsSubscriber: NatsjsSubscriber,
    private readonly auditService: AuditService,
  ) {}

  async list(ctx: IContext): Promise<{
    result: TopicEvent[];
    meta: { count: number; total: number; page: number; totalPage: number };
  }> {
    const query = ctx.params.query as TListTopicEventRequestQuery;
    const params = ctx.params.params as TTopicEventRequestParams;

    const { limit, offset, order, page } =
      parseQuery<TListTopicEventRequestQuery>(query);

    const selectOptions = {
      orderBy: order,
      where: { ...query.filters.field, topicId: params.topicId },
    };

    const pageOptions = {
      take: limit,
      skip: offset,
    };

    const [total, topicEvent] = await this.prisma.$transaction([
      this.prisma.topicEvent.count(selectOptions),
      this.prisma.topicEvent.findMany({
        ...pageOptions,
        ...selectOptions,
      }),
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
    ctx: IContext,
    topicId: string,
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

      await this.natsjsSubscriber.kv.put(
        topic.id,
        StringCodec().encode(JSON.stringify(topicUpdated)),
      );

      await this.auditService.sendAudit(ctx, AuditAction.CREATED, {
        id: topicEvent.id,
        incoming: topicEvent,
        auditable: Auditable.TOPIC_EVENT,
      });

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
    ctx: IContext,
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

      await this.natsjsSubscriber.kv.put(
        topic.id,
        StringCodec().encode(JSON.stringify(topicUpdated)),
      );

      await this.auditService.sendAudit(ctx, AuditAction.UPDATED, {
        id: result.id,
        prev: topicEvent,
        incoming: result,
        auditable: Auditable.TOPIC_EVENT,
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

  async deleteTopicEventById(
    ctx: IContext,
    topicEventId: string,
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

      await this.natsjsSubscriber.kv.put(
        topic.id,
        StringCodec().encode(JSON.stringify(topic)),
      );

      await this.auditService.sendAudit(ctx, AuditAction.DELETED, {
        id: result.id,
        prev: result,
        auditable: Auditable.TOPIC_EVENT,
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
}
