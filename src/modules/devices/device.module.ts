import { Module } from '@nestjs/common';
import { DeviceTypeController } from './device-type/device-type.controller';
import { DeviceTypeService } from './device-type/device-type.service';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';

@Module({
  controllers: [DeviceController, DeviceTypeController],
  providers: [DeviceService, DeviceTypeService],
})
export class DeviceModule {}
