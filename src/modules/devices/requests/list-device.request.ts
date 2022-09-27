import { Device, Prisma } from '@prisma/client';
import { IListRequestQuery } from '@/shared/types/query.type';

export type TListDeviceRequestQuery = IListRequestQuery<
  Device,
  Prisma.DeviceWhereInput
>;
