import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DashboardService } from './dashboards.service';
import { CreateDashboardDto } from './dto/create-dashboard.dto';
import { EditDashboardDto } from './dto/edit-dashboard.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboard() {
    return this.dashboardService.getDashboard();
  }

  @Get(':id')
  getDashboardById(@Param('id') dashboardId: string) {
    return this.dashboardService.getDashboardById(dashboardId);
  }

  @Post()
  createDashboard(@Body() dto: CreateDashboardDto) {
    return this.dashboardService.createDashboard(dto);
  }

  @Patch(':id')
  editDashboardById(
    @Param('id') dashboardId: string,
    @Body() dto: EditDashboardDto,
  ) {
    return this.dashboardService.editDashboardById(dashboardId, dto);
  }

  @Delete(':id')
  deleteDashboardById(@Param('id') dashboardId: string) {
    return this.dashboardService.deleteDashboardById(dashboardId);
  }
}
