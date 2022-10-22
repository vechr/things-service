import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import AuditService from '../audits/audit.service';
import { WidgetController } from '../widgets/widgets.controller';
import { WidgetService } from '../widgets/widgets.service';
import { DashboardController } from './dashboards.controller';
import { DashboardService } from './dashboards.service';
import appConstant from '@/constants/app.constant';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: appConstant.NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: [appConstant.NATS_URL],
        },
      },
    ]),
  ],
  controllers: [DashboardController, WidgetController],
  providers: [DashboardService, WidgetService, AuditService],
})
export class DashboardModule {}
