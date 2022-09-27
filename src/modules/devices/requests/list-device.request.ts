import { Device, Prisma } from '@prisma/client';
import { IListRequestQuery } from '@/shared/types/query.type';

export type IListDeviceRequestQuery = IListRequestQuery<
  Device,
  Prisma.DeviceWhereInput
>;
