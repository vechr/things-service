import { HttpStatus, Injectable } from '@nestjs/common';
import { Dashboard } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import AuditService from '../audits/audit.service';
import { AuditAction } from '../audits/types/audit-enum.type';
import { CreateDashboardDto, EditDashboardDto } from './dto';
import { TListDashboardRequestQuery } from './requests/list-dashboard.request';
import log from '@/shared/utils/log.util';
import {
  ForbiddenException,
  NotFoundException,
  UnknownException,
} from '@/shared/exceptions/common.exception';
import PrismaService from '@/prisma/prisma.service';
import { IContext } from '@/shared/interceptors/context.interceptor';
import { parseMeta, parseQuery } from '@/shared/utils/query.util';
import { Auditable } from '@/shared/types/auditable.type';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async list(ctx: IContext): Promise<{
    result: Dashboard[];
    meta: { count: number; total: number; page: number; totalPage: number };
  }> {
    const query = ctx.params.query as TListDashboardRequestQuery;

    const { limit, offset, order, page } =
      parseQuery<TListDashboardRequestQuery>(query);

    const selectOptions = {
      orderBy: order,
      where: query.filters.field,
    };

    const pageOptions = {
      take: limit,
      skip: offset,
    };

    const [total, result] = await this.prisma.$transaction([
      this.prisma.dashboard.count(selectOptions),
      this.prisma.dashboard.findMany({
        ...pageOptions,
        ...selectOptions,
        include: { devices: { include: { device: true } } },
      }),
    ]);

    const dashboards = result.map((dashboard) => {
      return {
        ...dashboard,
        devices: dashboard.devices.map((device) => device.device),
      };
    });

    const meta = parseMeta<Dashboard>({
      result: dashboards,
      total,
      page,
      limit,
    });

    return {
      result: dashboards,
      meta,
    };
  }

  async getDashboard(): Promise<Dashboard[]> {
    try {
      const result = await this.prisma.dashboard.findMany({
        include: {
          devices: {
            include: {
              device: true,
            },
          },
        },
      });

      const filter = result.map((dashboard) => {
        return {
          ...dashboard,
          devices: dashboard.devices.map((device) => device.device),
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

  async getDashboardDetails(): Promise<Record<string, any>> {
    try {
      const result = await this.prisma.dashboard.findMany({
        include: {
          devices: {
            include: {
              device: {
                include: {
                  deviceType: true,
                  topics: {
                    include: {
                      topicEvents: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const filter = result.map((dashboard) => {
        return {
          ...dashboard,
          devices: dashboard.devices.map((device) => device.device),
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

  async getDashboardById(dashboardId: string): Promise<Record<string, any>> {
    try {
      const dashboard = await this.prisma.dashboard.findUnique({
        where: {
          id: dashboardId,
        },
        include: {
          devices: {
            include: {
              device: true,
            },
          },
        },
      });

      if (!dashboard) {
        throw new NotFoundException({
          code: HttpStatus.NOT_FOUND.toString(),
          message: 'Dashboard is not found!',
        });
      }

      const filter = dashboard.devices.map((device) => {
        return device.device;
      });

      const response = {
        id: dashboard.id,
        name: dashboard.name,
        description: dashboard.description,
        createdAt: dashboard.createdAt,
        updatedAt: dashboard.updatedAt,
        devices: filter,
      };

      return response;
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

  async createDashboard(
    ctx: IContext,
    dto: CreateDashboardDto,
  ): Promise<Dashboard> {
    try {
      const dashboard = await this.prisma.dashboard.create({
        data: {
          ...dto,
        },
        include: {
          devices: {
            include: {
              device: true,
            },
          },
        },
      });

      await this.auditService.sendAudit(ctx, AuditAction.CREATED, {
        id: dashboard.id,
        incoming: dashboard,
        auditable: Auditable.DASHBOARD,
      });

      return dashboard;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        if (error.code === 'P2002') {
          throw new ForbiddenException({
            code: HttpStatus.FORBIDDEN.toString(),
            message: 'Dashboard already Exists!',
          });
        } else {
          throw new UnknownException({
            code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
            message: `Error unexpected!`,
            params: { exception: error.message },
          });
        }
      }
      throw error;
    }
  }

  async editDashboardById(
    ctx: IContext,
    dashboardId: string,
    { name, devices, description }: EditDashboardDto,
  ): Promise<Dashboard> {
    try {
      const dashboard = await this.prisma.dashboard.findUnique({
        where: {
          id: dashboardId,
        },
        include: {
          devices: {
            include: {
              device: true,
            },
          },
        },
      });

      if (!dashboard) {
        throw new NotFoundException({
          code: HttpStatus.NOT_FOUND.toString(),
          message: 'Dashboard is not found!',
        });
      }

      const result = await this.prisma.dashboard.update({
        where: {
          id: dashboardId,
        },
        data: {
          name,
          description,
          devices: {
            deleteMany: {},
            create: devices.map((device) => ({
              device: { connect: { id: device } },
            })),
          },
        },
        include: {
          devices: {
            include: {
              device: true,
            },
          },
        },
      });

      await this.auditService.sendAudit(ctx, AuditAction.UPDATED, {
        id: result.id,
        prev: dashboard,
        incoming: result,
        auditable: Auditable.DASHBOARD,
      });

      const filter = result.devices.map((device) => {
        return device.device;
      });

      const response = {
        id: result.id,
        name: result.name,
        description: result.description,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        devices: filter,
      };

      return response;
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

  async deleteDashboardById(ctx: IContext, dashboardId: string) {
    try {
      const dashboard = await this.prisma.dashboard.findUnique({
        where: {
          id: dashboardId,
        },
        include: {
          devices: {
            include: {
              device: true,
            },
          },
        },
      });

      if (!dashboard) {
        throw new NotFoundException({
          code: HttpStatus.NOT_FOUND.toString(),
          message: 'Dashboard is not found!',
        });
      }

      await this.prisma.dashboard.update({
        where: {
          id: dashboardId,
        },
        data: {
          devices: {
            deleteMany: {},
          },
        },
      });

      const result = await this.prisma.dashboard.delete({
        where: {
          id: dashboardId,
        },
      });

      await this.auditService.sendAudit(ctx, AuditAction.DELETED, {
        id: result.id,
        prev: result,
        auditable: Auditable.DASHBOARD,
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
