import PrismaService from '@/prisma/prisma.service';
import {
  ForbiddenException,
  NotFoundException,
} from '@/shared/exceptions/common.exception';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { EditTopicDto } from './dto/edit-topic.dto';

@Injectable()
export class TopicService {
  constructor(private readonly prisma: PrismaService) {}

  async getTopics(deviceId: string) {
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
  }

  async getTopicById(topicId: string) {
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
  }

  async createTopic(deviceId: string, { name, description }: CreateTopicDto) {
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
        deviceId,
      },
    });

    return topic;
  }

  async editTopicById(
    deviceId: string,
    topicId: string,
    { name, description }: EditTopicDto,
  ) {
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

    return this.prisma.topic.update({
      where: {
        id: topicId,
      },
      data: {
        name,
        description,
        deviceId,
      },
    });
  }

  async deleteTopicById(topicId: string) {
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
        message: 'Dashboard is not found!',
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
    });

    return result;
  }
}
