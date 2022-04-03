import { Controller, Get } from "@nestjs/common";
import { DeviceService } from "../devices/device.service";
import { TopicService } from "../topics/topic.service";
import { DashboardService } from "./dashboards.service";

@Controller()
export class DashboardController {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly dashboardService: DashboardService,
    private readonly topicService: TopicService
  ){}
  
  @Get('dashboard')
  halloDashboard() {
    return this.dashboardService.hallo();
  }

  @Get('device')
  halloDevice() {
    return this.deviceService.hallo();
  }

  @Get('topic')
  halloTopic() {
    return this.topicService.hallo();
  }
}