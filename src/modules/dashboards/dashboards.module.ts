import { Module } from "@nestjs/common";
import { DeviceModule } from "../devices/device.module";
import { TopicModule } from "../topics/topic.module";
import { DashboardController } from "./dashboards.controller";
import { DashboardService } from "./dashboards.service";

@Module({
  imports: [DeviceModule, TopicModule],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}