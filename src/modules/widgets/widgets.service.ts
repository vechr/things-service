import { HttpStatus, Injectable } from '@nestjs/common';
import { Widget } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import AuditService from '../audits/audit.service';
import { AuditAction } from '../audits/types/audit-enum.type';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import log from '@/shared/utils/log.util';
import {
  NotFoundException,
  UnknownException,
} from '@/shared/exceptions/common.exception';
import PrismaService from '@/prisma/prisma.service';
import { IContext } from '@/shared/interceptors/context.interceptor';
import { Auditable } from '@/shared/types/auditable.type';

@Injectable()
export class WidgetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

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
    ctx: IContext,
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
        include: {
          Dashboard: true,
          topic: true,
        },
      });

      await this.auditService.sendAudit(ctx, AuditAction.DELETED, {
        id: deleteWidget.id,
        prev: deleteWidget,
        auditable: Auditable.WIDGET,
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

  async editWidgetById(
    ctx: IContext,
    dashboardId: string,
    { description, name, node, shiftData, widgetData }: UpdateWidgetDto,
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

      const checkWidget = await this.prisma.widget.findUnique({
        where: {
          id: widgetId,
        },
        include: {
          Dashboard: true,
          topic: true,
        },
      });

      if (!checkWidget) {
        throw new NotFoundException({
          code: HttpStatus.NOT_FOUND.toString(),
          message: 'Widget is not found!',
        });
      }

      const checkWidgetDashboard = await this.prisma.widget.findMany({
        where: {
          AND: {
            dashboardId: dashboardId,
            id: widgetId,
          },
        },
      });

      if (!checkWidgetDashboard) {
        throw new NotFoundException({
          code: HttpStatus.NOT_FOUND.toString(),
          message: 'Widget is not belong to the Dashboard!',
        });
      }

      const result = await this.prisma.widget.update({
        where: {
          id: widgetId,
        },
        data: {
          node,
          description,
          name,
          shiftData,
          widgetData,
        },
        include: {
          Dashboard: true,
          topic: true,
        },
      });

      await this.auditService.sendAudit(ctx, AuditAction.UPDATED, {
        id: result.id,
        prev: checkWidget,
        incoming: result,
        auditable: Auditable.WIDGET,
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

  async createWidget(
    ctx: IContext,
    dashboardId: string,
    {
      name,
      widgetType,
      topicId,
      description,
      node,
      nodeId,
      shiftData,
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
          message: 'Topic is not belong to the Dashboard!',
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
          shiftData,
          dashboardId,
          topicId,
        },
        include: {
          Dashboard: true,
          topic: true,
        },
      });

      await this.auditService.sendAudit(ctx, AuditAction.CREATED, {
        id: widget.id,
        incoming: widget,
        auditable: Auditable.WIDGET,
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
