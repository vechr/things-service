import { Module } from '@nestjs/common';
import { DashboardController } from './dashboards.controller';
import { DashboardService } from './dashboards.service';
import { WidgetController } from './widgets/widgets.controller';
import { WidgetService } from './widgets/widgets.service';

@Module({
  controllers: [DashboardController, WidgetController],
  providers: [DashboardService, WidgetService],
})
export class DashboardModule {}
