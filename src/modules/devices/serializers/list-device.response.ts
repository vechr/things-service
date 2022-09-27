import { Device } from '@prisma/client';

export default class ListDeviceResponse implements Device {
  id: string;

  deviceTypeId: string;

  name: string;

  description: string | null;

  isActive: boolean;

  // @Exclude()
  createdAt: Date;

  // @Exclude()
  updatedAt: Date;
}
