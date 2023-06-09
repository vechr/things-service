import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import AuditService from '../audits/audit.service';
import { TopicEventController } from './topic-event.controller';
import { TopicEventService } from './topic-event.service';
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
  providers: [TopicEventService, AuditService],
  controllers: [TopicEventController],
  exports: [TopicEventService],
})
export class TopicEventModule {}
