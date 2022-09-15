import { Module } from '@nestjs/common';
import { WidgetController } from '../widgets/widgets.controller';
import { WidgetService } from '../widgets/widgets.service';
import { DashboardController } from './dashboards.controller';
import { DashboardService } from './dashboards.service';

@Module({
  controllers: [DashboardController, WidgetController],
  providers: [DashboardService, WidgetService],
})
export class DashboardModule {}
