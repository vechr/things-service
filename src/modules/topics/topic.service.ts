import PrismaService from '@/prisma/prisma.service';
import { NotFoundException } from '@/shared/exceptions/common.exception';
import SuccessResponse from '@/shared/responses/success.response';
import { Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { EditTopicDto } from './dto/edit-topic.dto';

@Injectable()
export class TopicService {
  constructor(private readonly prisma: PrismaService) {}

  async getTopics(deviceId: string) {
    const result = await this.prisma.topic.findMany({
      where: {
        deviceId
      },
      include: {
        topicEvents: true
      }
    });


    const filter = result.map((topic) => {
      return {...topic, topicEvents: topic.topicEvents.map((topicEvents) => topicEvents)}
    })

    return filter;
  }

  async getTopicById(topicId: string) {
    const topic = await this.prisma.topic.findUnique({
      where: {
        id: topicId,
      },
      include: {
        topicEvents: true
      }
    });

    if (!topic) {
      throw new NotFoundException({
        code: '404',
        message: 'Topic is not found!',
      });
    }

    return topic;
  }

  async createTopic(dto: CreateTopicDto) {
    const device = await this.prisma.device.findUnique({
      where: {
        id: dto.deviceId,
      },
    });

    if (!device) {
      throw new NotFoundException({
        code: '404',
        message: 'Device is not found!',
      });
    }

    const topic = await this.prisma.topic.create({
      data: {
        ...dto,
      }
    });

    return topic;
  }
  

  async editTopicById(topicId: string, {name, description, deviceId}: EditTopicDto) {
    const topic = await this.prisma.topic.findUnique({
      where: {
        id: topicId,
      },
    });

    if (!topic) {
      throw new NotFoundException({
        code: '404',
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
        code: '404',
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
        deviceId
      },
    });
  }

  async deleteTopicById(topicId: string) {
    const topic = await this.prisma.topic.findUnique({
      where: {
        id: topicId,
      },
    });

    if (!topic) {
      throw new NotFoundException({
        code: '404',
        message: 'Dashboard is not found!',
      });
    }

    const result = await this.prisma.topic.delete({
      where: {
        id: topicId,
      },
    });

    return new SuccessResponse(
      `Topic: ${topicId} success deleted!`,
      result,
    );
  }
}
