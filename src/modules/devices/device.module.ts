import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import AuditService from '../audits/audit.service';
import { DeviceTypeController } from '../device-type/device-type.controller';
import { DeviceTypeService } from '../device-type/device-type.service';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import appConstant from '@/constants/app.constant';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: appConstant.NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: [appConstant.NATS_URL],
          maxReconnectAttempts: 10,
          tls: {
            caFile: appConstant.NATS_CA,
            keyFile: appConstant.NATS_KEY,
            certFile: appConstant.NATS_CERT,
          },
        },
      },
    ]),
  ],
  controllers: [DeviceController, DeviceTypeController],
  providers: [DeviceService, DeviceTypeService, AuditService],
})
export class DeviceModule {}
