import { DeviceType } from '@prisma/client';
// import { Exclude } from 'class-transformer';

export default class ListDeviceTypeResponse implements DeviceType {
  id: string;

  name: string;

  description: string | null;

  // @Exclude()
  createdAt: Date;

  // @Exclude()
  updatedAt: Date;
}
