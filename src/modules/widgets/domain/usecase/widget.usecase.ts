import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '../../../../core/base/domain/usecase/base.usecase';
import { Widget } from '../entities/widget.entity';
import { Prisma } from '@prisma/client';
import { WidgetRepository } from '../../data/widget.repository';
import PrismaService from '@/core/base/frameworks/data-services/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import log from '@/core/base/frameworks/shared/utils/log.util';
import {
  EErrorCommonCode,
  UnknownException,
} from '@/core/base/frameworks/shared/exceptions/common.exception';
import { OtelMethodCounter, Span } from 'nestjs-otel';

@Injectable()
export class WidgetUseCase extends BaseUseCase<
  Widget,
  Prisma.WidgetInclude,
  Prisma.WidgetSelect,
  Prisma.WidgetWhereInput | Prisma.WidgetWhereUniqueInput,
  Prisma.XOR<Prisma.WidgetCreateInput, Prisma.WidgetUncheckedCreateInput>,
  Prisma.WidgetCreateManyInput[] | Prisma.WidgetCreateManyInput,
  Prisma.XOR<Prisma.WidgetUpdateInput, Prisma.WidgetUncheckedUpdateInput>
> {
  constructor(
    protected repository: WidgetRepository,
    db: PrismaService,
  ) {
    super(repository, db);
  }

  @OtelMethodCounter()
  @Span('usecase get all widget by dashboard id')
  async getAllWidgetByDashboardId(dashboardId: string): Promise<Widget[]> {
    try {
      return await this.db.$transaction(async (tx) => {
        return await this.repository.getMany(tx, undefined, undefined, {
          dashboardId,
        });
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
}
