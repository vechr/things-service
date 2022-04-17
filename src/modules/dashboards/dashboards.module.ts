import { Module } from '@nestjs/common';
import { DashboardController } from './dashboards.controller';
import { DashboardService } from './dashboards.service';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
