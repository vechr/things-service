import { DeviceType, Prisma } from '@prisma/client';
import { IListRequestQuery } from '@/shared/types/query.type';

export type TListDeviceTypeRequestQuery = IListRequestQuery<
  DeviceType,
  Prisma.DeviceTypeWhereInput
>;
