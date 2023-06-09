import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import AuditService from '../audits/audit.service';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
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
  providers: [TopicService, AuditService],
  controllers: [TopicController],
  exports: [TopicService],
})
export class TopicModule {}
