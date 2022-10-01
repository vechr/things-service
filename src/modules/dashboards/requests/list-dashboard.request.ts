import { Dashboard, Prisma } from '@prisma/client';
import { IListRequestQuery } from '@/shared/types/query.type';

export type TListDashboardRequestQuery = IListRequestQuery<
  Dashboard,
  Prisma.DashboardWhereInput
>;
