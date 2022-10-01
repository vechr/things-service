import { Device, DeviceType, Topic, WidgetType } from '@prisma/client';

export class ListDeviceDeviceTypeResponse implements DeviceType {
  id: string;

  name: string;

  description: string | null;

  createdAt: Date;

  updatedAt: Date;
}
export class ListDeviceTopicsResponse implements Topic {
  id: string;

  deviceId: string;

  name: string;

  description: string | null;

  widgetType: WidgetType | null;

  createdAt: Date;

  updatedAt: Date;
}
export default class ListDeviceResponse<T, D> implements Device {
  id: string;

  deviceTypeId: string;

  name: string;

  description: string | null;

  isActive: boolean;

  // @Exclude()
  createdAt: Date;

  // @Exclude()
  updatedAt: Date;

  topics: T;

  deviceType: D;
}
