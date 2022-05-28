import PrismaService from '@/prisma/prisma.service';
import { NotFoundException } from '@/shared/exceptions/common.exception';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateWidgetDto } from './dto/create-widget.dto';

@Injectable()
export class WidgetService {
  constructor(private readonly prisma: PrismaService) {}

  async getWidgets(dashboardId: string) {
    const result = await this.prisma.widget.findMany({
      where: {
        dashboardId: dashboardId,
      },
    });

    return result;
  }

  async createWidget(
    dashboardId: string,
    {
      name,
      widgetType,
      topicId,
      description,
      node,
      widgetData,
    }: CreateWidgetDto,
  ) {
    const checkDashboard = await this.prisma.dashboard.findUnique({
      where: {
        id: dashboardId,
      },
    });

    if (!checkDashboard) {
      throw new NotFoundException({
        code: HttpStatus.NOT_FOUND.toString(),
        message: 'Dashboard is not found!',
      });
    }

    const checkTopic = await this.prisma.topic.findUnique({
      where: {
        id: topicId,
      },
    });

    if (!checkTopic) {
      throw new NotFoundException({
        code: HttpStatus.NOT_FOUND.toString(),
        message: 'Topic is not found!',
      });
    }

    const checkTopicDashboard = await this.prisma.topic.findMany({
      where: {
        device: {
          dashboards: {
            some: {
              dashboardId: dashboardId,
            },
          },
        },
      },
    });

    if (!checkTopicDashboard) {
      throw new NotFoundException({
        code: HttpStatus.NOT_FOUND.toString(),
        message: 'Topic is belong to the Dashboard!',
      });
    }

    const widget = await this.prisma.widget.create({
      data: {
        name,
        widgetType,
        dashboardId,
        topicId,
        description,
        node,
        widgetData,
      },
    });

    return widget;
  }
}
