import { Dashboard } from '@prisma/client';
// import { Exclude } from 'class-transformer';

export default class ListDashboardResponse implements Dashboard {
  id: string;

  name: string;

  description: string | null;

  // @Exclude()
  createdAt: Date;

  // @Exclude()
  updatedAt: Date;
}
