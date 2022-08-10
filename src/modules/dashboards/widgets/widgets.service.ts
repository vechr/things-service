import PrismaService from '@/prisma/prisma.service';
import {
  NotFoundException,
  UnknownException,
} from '@/shared/exceptions/common.exception';
import log from '@/shared/utils/log.util';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Widget } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { CreateWidgetDto } from './dto/create-widget.dto';

@Injectable()
export class WidgetService {
  constructor(private readonly prisma: PrismaService) {}

  async getWidgets(dashboardId: string): Promise<Widget[]> {
    try {
      const result = await this.prisma.widget.findMany({
        where: {
          dashboardId: dashboardId,
        },
        include: {
          Dashboard: true,
          topic: true,
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

  async deleteWidgetById(
    dashboardId: string,
    widgetId: string,
  ): Promise<Widget> {
    try {
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

      const deleteWidget = await this.prisma.widget.delete({
        where: {
          id: widgetId,
        },
      });

      return deleteWidget;
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

  async createWidget(
    dashboardId: string,
    {
      name,
      widgetType,
      topicId,
      description,
      node,
      nodeId,
      hidden,
      persistance,
      widgetData,
    }: CreateWidgetDto,
  ): Promise<Widget> {
    try {
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
          description,
          node,
          nodeId,
          widgetType,
          widgetData,
          persistance,
          hidden,
          dashboardId,
          topicId,
        },
        include: {
          Dashboard: true,
          topic: true,
        },
      });

      return widget;
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
