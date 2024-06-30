import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '../../../../core/base/domain/usecase/base.usecase';
import { Dashboard, DashboardWithMapping } from '../entities/dashboard.entity';
import { Prisma } from '@prisma/client';
import { DashboardRepository } from '../../data/dashboard.repository';
import PrismaService from '@/core/base/frameworks/data-services/prisma/prisma.service';
import { OtelMethodCounter, Span } from 'nestjs-otel';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import log from '@/core/base/frameworks/shared/utils/log.util';
import {
  EErrorCommonCode,
  UnknownException,
} from '@/core/base/frameworks/shared/exceptions/common.exception';

@Injectable()
export class DashboardUseCase extends BaseUseCase<
  Dashboard | DashboardWithMapping,
  Prisma.DashboardInclude,
  Prisma.DashboardSelect,
  Prisma.DashboardWhereInput | Prisma.DashboardWhereUniqueInput,
  Prisma.XOR<Prisma.DashboardCreateInput, Prisma.DashboardUncheckedCreateInput>,
  Prisma.DashboardCreateManyInput[] | Prisma.DashboardCreateManyInput,
  Prisma.XOR<Prisma.DashboardUpdateInput, Prisma.DashboardUncheckedUpdateInput>
> {
  constructor(
    protected repository: DashboardRepository,
    db: PrismaService,
  ) {
    super(repository, db);
  }

  @OtelMethodCounter()
  @Span('usecase get all dashboard with Details')
  async getAllDashboardWithDetails(): Promise<DashboardWithMapping[]> {
    try {
      return await this.db.$transaction(async (tx) => {
        const result = await this.repository.getMany(tx, {
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
        });

        return this.dashboardListMapping(result);
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during retrieve a list!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  private dashboardListMapping(data: Dashboard[]): DashboardWithMapping[] {
    return data.map((dashboard) => {
      return {
        ...dashboard,
        devices: dashboard.devices.map((device) => device.device),
      };
    });
  }
}
