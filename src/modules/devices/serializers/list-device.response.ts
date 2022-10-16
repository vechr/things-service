import { Device, DeviceType, Topic, WidgetType } from '@prisma/client';
import { Type } from 'class-transformer';

export class ListDeviceTypeResponse implements DeviceType {
  id: string;

  name: string;

  description: string | null;

  createdAt: Date;

  updatedAt: Date;
}
export class ListTopicsResponse implements Topic {
  id: string;

  deviceId: string;

  name: string;

  description: string | null;

  widgetType: WidgetType | null;

  createdAt: Date;

  updatedAt: Date;
}
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

  @Type(() => ListTopicsResponse)
  topics: ListTopicsResponse[];

  @Type(() => ListDeviceTypeResponse)
  deviceType: ListDeviceTypeResponse;
}
