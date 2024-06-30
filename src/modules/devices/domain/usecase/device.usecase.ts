import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '../../../../core/base/domain/usecase/base.usecase';
import { Device } from '../entities/device.entity';
import { Prisma } from '@prisma/client';
import { DeviceRepository } from '../../data/device.repository';
import PrismaService from '@/core/base/frameworks/data-services/prisma/prisma.service';

@Injectable()
export class DeviceUseCase extends BaseUseCase<
  Device,
  Prisma.DeviceInclude,
  Prisma.DeviceSelect,
  Prisma.DeviceWhereInput | Prisma.DeviceWhereUniqueInput,
  Prisma.XOR<Prisma.DeviceCreateInput, Prisma.DeviceUncheckedCreateInput>,
  Prisma.DeviceCreateManyInput[] | Prisma.DeviceCreateManyInput,
  Prisma.XOR<Prisma.DeviceUpdateInput, Prisma.DeviceUncheckedUpdateInput>
> {
  constructor(
    protected repository: DeviceRepository,
    db: PrismaService,
  ) {
    super(repository, db);
  }
}
