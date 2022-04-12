import PrismaService from '@/prisma/prisma.service';
import { NotFoundException } from '@/shared/exceptions/common.exception';
import SuccessResponse from '@/shared/responses/success.response';
import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { EditDashboardDto } from './dto/edit-dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    return await this.prisma.dashboard.findMany();
  }

  async getDashboardById(dashboardId: string) {
    const dashboard = await this.prisma.dashboard.findFirst({
      where: {
        id: dashboardId,
      },
    });

    if (!dashboard) {
      throw new NotFoundException({code: '404', message: 'Dashboard is not found!'});
    }

    return dashboard;
  }

  async createDashboard(dto: CreateDashboardDto) {
    const dashboard = await this.prisma.dashboard.create({
      data: {
        ...dto,
      },
    });

    return dashboard;
  }

  async editDashboardById(dashboardId: string, dto: EditDashboardDto) {
    const dashboard = await this.prisma.dashboard.findUnique({
      where: {
        id: dashboardId,
      },
    });

    if (!dashboard) {
      throw new NotFoundException({code: '404', message: 'Dashboard is not found!'});
    }

    return this.prisma.dashboard.update({
      where: {
        id: dashboardId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteDashboardById(dashboardId: string) {
    const dashboard = await this.prisma.dashboard.findUnique({
      where: {
        id: dashboardId,
      },
    });

    if (!dashboard) {
      throw new NotFoundException({code: '404', message: 'Dashboard is not found!'});
    }

    const result = await this.prisma.dashboard.delete({
      where: {
        id: dashboardId,
      },
    });

    return new SuccessResponse(`Dashboard: ${dashboardId} success deleted!`, result);
  }
}
