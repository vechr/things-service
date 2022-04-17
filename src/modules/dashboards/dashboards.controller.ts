import SuccessResponse from '@/shared/responses/success.response';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboards.service';
import { CreateDashboardDto, EditDashboardDto } from './dto';


@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  public async getDashboard(): Promise<SuccessResponse> {
    const result = await this.dashboardService.getDashboard();
    return new SuccessResponse('Success get all records!', result); 
  }

  @Get(':id')
  public async getDashboardById(@Param('id') dashboardId: string): Promise<SuccessResponse> {
    const result = await this.dashboardService.getDashboardById(dashboardId);
    return new SuccessResponse(`Success get Dashboard ${dashboardId}!`, result);
  }
  
  @Post()
  public async createDashboard(@Body() dto: CreateDashboardDto): Promise<SuccessResponse> {
    const result = await this.dashboardService.createDashboard(dto);
    return new SuccessResponse(`Success Create Dashboard!`, result);
  }

  @Patch(':id')
  public async editDashboardById(
    @Param('id') dashboardId: string,
    @Body() dto: EditDashboardDto,
  ): Promise<SuccessResponse> {
    const result = await this.dashboardService.editDashboardById(dashboardId, dto);
    return new SuccessResponse(`Success update Dashboard ${dashboardId}!`, result);
  }

  @Delete(':id')
  public async deleteDashboardById(@Param('id') dashboardId: string) {
    const result = await this.dashboardService.deleteDashboardById(dashboardId);
    return new SuccessResponse(`Dashboard: ${dashboardId} success deleted!`, result);
  }
}
