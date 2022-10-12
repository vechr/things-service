import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Version,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboards.service';
import { CreateDashboardDto, EditDashboardDto } from './dto';
import ListDashboardValidator, {
  ListDashboardQueryValidator,
} from './validators/list-dashboard.validator';
import ListDashboardResponse from './serializers/list-dashboard.response';
import SuccessResponse from '@/shared/responses/success.response';
import UseList from '@/shared/decorators/uselist.decorator';
import Validator from '@/shared/decorators/validator.decorator';
import Serializer from '@/shared/decorators/serializer.decorator';
import Context from '@/shared/decorators/context.decorator';
import { IContext } from '@/shared/interceptors/context.interceptor';
import { ApiFilterQuery } from '@/shared/decorators/api-filter-query.decorator';
@ApiTags('Dashboard')
@Controller('things/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Version('2')
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseList()
  @Validator(ListDashboardValidator)
  @Serializer(ListDashboardResponse)
  @ApiFilterQuery('filters', ListDashboardQueryValidator)
  public async list(@Context() ctx: IContext): Promise<SuccessResponse> {
    const { result, meta } = await this.dashboardService.list(ctx);
    return new SuccessResponse('Success get all records!', result, meta);
  }

  @Get()
  public async getDashboard(): Promise<SuccessResponse> {
    const result = await this.dashboardService.getDashboard();
    return new SuccessResponse('Success get all records!', result);
  }

  @Get('details')
  public async getDashboardDetails(): Promise<SuccessResponse> {
    const result = await this.dashboardService.getDashboardDetails();
    return new SuccessResponse('Success get all records!', result);
  }

  @Get(':id')
  public async getDashboardById(
    @Param('id') dashboardId: string,
  ): Promise<SuccessResponse> {
    const result = await this.dashboardService.getDashboardById(dashboardId);
    return new SuccessResponse(`Success get Dashboard ${result.name}!`, result);
  }

  @Post()
  public async createDashboard(
    @Body() dto: CreateDashboardDto,
  ): Promise<SuccessResponse> {
    const result = await this.dashboardService.createDashboard(dto);
    return new SuccessResponse(`Success Create Dashboard!`, result);
  }

  @Patch(':id')
  public async editDashboardById(
    @Param('id') dashboardId: string,
    @Body() dto: EditDashboardDto,
  ): Promise<SuccessResponse> {
    const result = await this.dashboardService.editDashboardById(
      dashboardId,
      dto,
    );
    return new SuccessResponse(
      `Success update Dashboard ${result.name}!`,
      result,
    );
  }

  @Delete(':id')
  public async deleteDashboardById(@Param('id') dashboardId: string) {
    const result = await this.dashboardService.deleteDashboardById(dashboardId);
    return new SuccessResponse(
      `Dashboard: ${result.name} success deleted!`,
      result,
    );
  }
}
