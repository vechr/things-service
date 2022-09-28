import { Device, DeviceType } from '@prisma/client';
// import { Exclude } from 'class-transformer';

class ListDeviceTypeDevice implements Device {
  id: string;

  deviceTypeId: string;

  name: string;

  description: string | null;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}

export default class ListDeviceTypeResponse implements DeviceType {
  id: string;

  name: string;

  description: string | null;

  devices: ListDeviceTypeDevice;

  // @Exclude()
  createdAt: Date;

  // @Exclude()
  updatedAt: Date;
}
