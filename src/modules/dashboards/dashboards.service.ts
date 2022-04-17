import PrismaService from '@/prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@/shared/exceptions/common.exception';
import SuccessResponse from '@/shared/responses/success.response';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateDashboardDto, EditDashboardDto } from './dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const result = await this.prisma.dashboard.findMany({
      include: {
        devices: {
          include: {
            device: true
          }
        }
      }
    });


    const filter = result.map((dashboard) => {
      return {...dashboard, devices: dashboard.devices.map((device) => device.device)}
    })

    return filter;
  }

  async getDashboardById(dashboardId: string) {
    const dashboard = await this.prisma.dashboard.findUnique({
      where: {
        id: dashboardId,
      },
      include: {
        devices: {
          include: {
            device: true
          }
        }
      }
    });

    if (!dashboard) {
      throw new NotFoundException({
        code: HttpStatus.NOT_FOUND.toString(),
        message: 'Dashboard is not found!',
      });
    }

    return dashboard;
  }

  async createDashboard(dto: CreateDashboardDto) {
    const dashboard = await this.prisma.dashboard.create({
      data: {
        ...dto,
      }
    });

    return dashboard;
  }
  

  async editDashboardById(dashboardId: string, {name, devices, description}: EditDashboardDto) {
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
            device: {connect: {id: device.id}}
          }))
        }
      }
    });

    return result;
  }

  async deleteDashboardById(dashboardId: string) {
    const dashboard = await this.prisma.dashboard.findUnique({
      where: {
        id: dashboardId,
      },
      include: {
        devices: true
      }
    });

    if (!dashboard) {
      throw new NotFoundException({
        code: HttpStatus.NOT_FOUND.toString(),
        message: 'Dashboard is not found!',
      });
    }

    if (dashboard.devices.length > 0) {
      throw new ForbiddenException({
        code: HttpStatus.FORBIDDEN.toString(),
        message: "Dashboard contain some devices, you cannot delete this dashboard!"
      })
    }

    const result = await this.prisma.dashboard.delete({
      where: {
        id: dashboardId,
      },
    });

    return new SuccessResponse(
      `Dashboard: ${dashboardId} success deleted!`,
      result,
    );
  }
}
