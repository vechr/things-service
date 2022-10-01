import { Dashboard, Device } from '@prisma/client';
// import { Exclude } from 'class-transformer';

export class ListDashboardDeviceResponse implements Device {
  // @Exclude()
  id: string;

  // @Exclude()
  deviceTypeId: string;

  name: string;

  // @Exclude()
  description: string | null;

  // @Exclude()
  isActive: boolean;

  // @Exclude()
  createdAt: Date;

  // @Exclude()
  updatedAt: Date;
}

export default class ListDashboardResponse<T> implements Dashboard {
  id: string;

  name: string;

  description: string | null;

  devices: T;

  // @Exclude()
  createdAt: Date;

  // @Exclude()
  updatedAt: Date;
}
