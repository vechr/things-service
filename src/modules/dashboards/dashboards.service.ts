import { HttpStatus, Injectable } from '@nestjs/common';
import { Dashboard } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { CreateDashboardDto, EditDashboardDto } from './dto';
import log from '@/shared/utils/log.util';
import {
  ForbiddenException,
  NotFoundException,
  UnknownException,
} from '@/shared/exceptions/common.exception';
import PrismaService from '@/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

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

  async createDashboard(dto: CreateDashboardDto): Promise<Dashboard> {
    try {
      const dashboard = await this.prisma.dashboard.create({
        data: {
          ...dto,
        },
        include: {
          devices: true,
        },
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
    dashboardId: string,
    { name, devices, description }: EditDashboardDto,
  ): Promise<Dashboard> {
    try {
      const dashboard = await this.prisma.dashboard.findUnique({
        where: {
          id: dashboardId,
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

  async deleteDashboardById(dashboardId: string) {
    try {
      const dashboard = await this.prisma.dashboard.findUnique({
        where: {
          id: dashboardId,
        },
        include: {
          devices: true,
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
