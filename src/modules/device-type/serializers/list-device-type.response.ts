import { Device, DeviceType } from '@prisma/client';
import { Type } from 'class-transformer';
// import { Exclude } from 'class-transformer';

export class ListDeviceResponse implements Device {
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

  @Type(() => ListDeviceResponse)
  devices: ListDeviceResponse[];

  // @Exclude()
  createdAt: Date;

  // @Exclude()
  updatedAt: Date;
}
