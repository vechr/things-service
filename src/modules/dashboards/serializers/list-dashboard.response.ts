import { Dashboard, Device } from '@prisma/client';
import { Type } from 'class-transformer';
// import { Exclude } from 'class-transformer';

export class ListDeviceResponse implements Device {
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

export default class ListDashboardResponse implements Dashboard {
  id: string;

  name: string;

  description: string | null;

  @Type(() => ListDeviceResponse)
  devices: ListDeviceResponse[];

  // @Exclude()
  createdAt: Date;

  // @Exclude()
  updatedAt: Date;
}
