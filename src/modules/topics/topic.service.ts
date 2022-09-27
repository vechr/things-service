import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import { Topic } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { lastValueFrom } from 'rxjs';
import { DBLoggerDto, QueryCreateEventDto } from './dto';
import { CreateTopicDto } from './dto/create-topic.dto';
import { EditTopicDto } from './dto/edit-topic.dto';
import {
  IListTopicRequestQuery,
  TTopicRequestParams,
} from './requests/list-topic.request';
import log from '@/shared/utils/log.util';
import {
  ForbiddenException,
  NotFoundException,
  UnknownException,
} from '@/shared/exceptions/common.exception';
import PrismaService from '@/prisma/prisma.service';
import { NatsService } from '@/modules/services/nats.service';
import { IContext } from '@/shared/interceptors/context.interceptor';
import { parseMeta, parseQuery } from '@/shared/utils/query.util';

@Injectable()
export class TopicService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('DB_LOGGER_SERVICE') private readonly dbLoggerClient: ClientNats,
  ) {}

  async list(ctx: IContext): Promise<{
    result: Topic[];
    meta: { count: number; total: number; page: number; totalPage: number };
  }> {
    const query = ctx.params.query as IListTopicRequestQuery;
    const params = ctx.params.params as TTopicRequestParams;

    const { limit, offset, order, page } =
      parseQuery<IListTopicRequestQuery>(query);

    const selectOptions = {
      orderBy: order,
      where: query.filters.field,
    };

    const pageOptions = {
      take: limit,
      skip: offset,
    };

    const [total, topic] = await this.prisma.$transaction([
      this.prisma.topic.count(selectOptions),
      this.prisma.topic.findMany({
        ...pageOptions,
        ...selectOptions,
        where: { deviceId: params.deviceId },
      }),
    ]);

    const meta = parseMeta<Topic>({
      result: topic,
      total,
      page,
      limit,
    });

    return {
      result: topic,
      meta,
    };
  }

  async getDataTopic(dto: DBLoggerDto) {
    const source = this.dbLoggerClient.send(
      'getData.query',
      new QueryCreateEventDto(
        dto.dashboardId,
        dto.deviceId,
        dto.topicId,
        dto.topic,
      ),
    );
    return await lastValueFrom(source);
  }

  async getTopics(deviceId: string): Promise<Topic[]> {
    try {
      const result = await this.prisma.topic.findMany({
        where: {
          deviceId,
        },
        include: {
          topicEvents: true,
        },
      });

      const filter = result.map((topic) => {
        return {
          ...topic,
          topicEvents: topic.topicEvents.map((topicEvents) => topicEvents),
        };
      });

      return filter;
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

  async getTopicById(topicId: string): Promise<Topic> {
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

      return topic;
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

  async createTopic(
    deviceId: string,
    { name, description, widgetType }: CreateTopicDto,
  ): Promise<Topic> {
    try {
      const device = await this.prisma.device.findUnique({
        where: {
          id: deviceId,
        },
      });

      if (!device) {
        throw new NotFoundException({
          code: HttpStatus.NOT_FOUND.toString(),
          message: 'Device is not found!',
        });
      }

      const topic = await this.prisma.topic.create({
        data: {
          name,
          description,
          widgetType,
          deviceId,
        },
        include: {
          topicEvents: true,
        },
      });

      await NatsService.kv.put(
        topic.id,
        NatsService.sc.encode(JSON.stringify(topic)),
      );

      return topic;
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

  async editTopicById(
    deviceId: string,
    topicId: string,
    { name, description }: EditTopicDto,
  ): Promise<Topic> {
    try {
      const topic = await this.prisma.topic.findUnique({
        where: {
          id: topicId,
        },
      });

      if (!topic) {
        throw new NotFoundException({
          code: HttpStatus.NOT_FOUND.toString(),
          message: 'Topic is not found!',
        });
      }

      const device = await this.prisma.device.findUnique({
        where: {
          id: deviceId,
        },
      });

      if (!device) {
        throw new NotFoundException({
          code: HttpStatus.NOT_FOUND.toString(),
          message: 'Device is not found!',
        });
      }

      const topicUpdated = await this.prisma.topic.update({
        where: {
          id: topicId,
        },
        data: {
          name,
          description,
          deviceId,
        },
        include: {
          topicEvents: true,
        },
      });

      await NatsService.kv.put(
        topicUpdated.id,
        NatsService.sc.encode(JSON.stringify(topicUpdated)),
      );

      return topicUpdated;
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

  async deleteTopicById(topicId: string) {
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

      if (topic.topicEvents.length > 0) {
        throw new ForbiddenException({
          code: HttpStatus.FORBIDDEN.toString(),
          message:
            'Topic contain some topic event, you cannot delete this Topic!',
        });
      }

      const result = await this.prisma.topic.delete({
        where: {
          id: topicId,
        },
        include: {
          topicEvents: true,
        },
      });

      await NatsService.kv.purge(result.id);

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
