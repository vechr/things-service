import PrismaService from "@/prisma/prisma.service";
import SuccessResponse from "@/shared/responses/success.response";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTopicEventDto } from "./dto/create-topic-event.dto";
import { EditTopicEventDto } from "./dto/edit-topic-event.dto";

@Injectable()
export class TopicEventService {
  constructor(private readonly prisma: PrismaService) {}

  async getTopicEvents(topicId: string) {
    const result = await this.prisma.topicEvent.findMany({
      where: {
        topicId
      }
    });

    return result;
  }

  async getTopicEventById(topicEventId: string) {
    const topicEvent = await this.prisma.topicEvent.findUnique({
      where: {
        id: topicEventId,
      }
    });

    if (!topicEvent) {
      throw new NotFoundException({
        code: '404',
        message: 'Topic Event is not found!',
      });
    }

    return topicEvent;
  }

  async createTopicEvent(dto: CreateTopicEventDto) {
    const topics = await this.prisma.topic.findUnique({
      where: {
        id: dto.topicId,
      },
    });

    if (!topics) {
      throw new NotFoundException({
        code: '404',
        message: 'Topic is not found!',
      });
    }

    const topicEvent = await this.prisma.topicEvent.create({
      data: {
        ...dto
      }
    });

    return topicEvent;
  }
  

  async editTopicEventById(topicEventId: string, {name, description, eventExpression, topicId}: EditTopicEventDto) {
    const topicEvent = await this.prisma.topicEvent.findUnique({
      where: {
        id: topicEventId,
      },
    });

    if (!topicEvent) {
      throw new NotFoundException({
        code: '404',
        message: 'Topic Event is not found!',
      });
    }

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

    return this.prisma.topicEvent.update({
      where: {
        id: topicEventId,
      },
      data: {
        name,
        description,
        eventExpression,
        topicId
      },
    });
  }

  async deleteTopicEventById(topicEventId: string) {
    const topicEvent = await this.prisma.topicEvent.findUnique({
      where: {
        id: topicEventId,
      },
    });

    if (!topicEvent) {
      throw new NotFoundException({
        code: '404',
        message: 'Topic Event is not found!',
      });
    }

    const result = await this.prisma.topicEvent.delete({
      where: {
        id: topicEventId,
      },
    });

    return new SuccessResponse(
      `Topic: ${topicEventId} success deleted!`,
      result,
    );
  }
}