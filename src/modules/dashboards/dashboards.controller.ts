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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OtelInstanceCounter, OtelMethodCounter } from 'nestjs-otel';
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
import Authentication from '@/shared/decorators/authentication.decorator';
import Authorization from '@/shared/decorators/authorization.decorator';
@ApiTags('Dashboard')
@ApiBearerAuth('access-token')
@Controller('things/dashboard')
@OtelInstanceCounter()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Version('2')
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseList()
  @Authentication(true)
  @Authorization('dashboards:read@auth')
  @Validator(ListDashboardValidator)
  @Serializer(ListDashboardResponse)
  @ApiFilterQuery('filters', ListDashboardQueryValidator)
  @OtelMethodCounter()
  public async list(@Context() ctx: IContext): Promise<SuccessResponse> {
    const { result, meta } = await this.dashboardService.list(ctx);
    return new SuccessResponse('Success get all records!', result, meta);
  }

  @Get()
  @Authentication(true)
  @Authorization('dashboards:read@auth')
  @OtelMethodCounter()
  public async getDashboard(): Promise<SuccessResponse> {
    const result = await this.dashboardService.getDashboard();
    return new SuccessResponse('Success get all records!', result);
  }

  @Get('details')
  @Authentication(true)
  @Authorization('dashboards:read@auth')
  @OtelMethodCounter()
  public async getDashboardDetails(): Promise<SuccessResponse> {
    const result = await this.dashboardService.getDashboardDetails();
    return new SuccessResponse('Success get all records!', result);
  }

  @Get(':id')
  @Authentication(true)
  @Authorization('dashboards:read@auth')
  @OtelMethodCounter()
  public async getDashboardById(
    @Param('id') dashboardId: string,
  ): Promise<SuccessResponse> {
    const result = await this.dashboardService.getDashboardById(dashboardId);
    return new SuccessResponse(`Success get Dashboard ${result.name}!`, result);
  }

  @Post()
  @Authentication(true)
  @Authorization('dashboards:create@auth')
  @OtelMethodCounter()
  public async createDashboard(
    @Context() ctx: IContext,
    @Body() dto: CreateDashboardDto,
  ): Promise<SuccessResponse> {
    const result = await this.dashboardService.createDashboard(ctx, dto);
    return new SuccessResponse(`Success Create Dashboard!`, result);
  }

  @Patch(':id')
  @Authentication(true)
  @Authorization('dashboards:update@auth')
  @OtelMethodCounter()
  public async editDashboardById(
    @Context() ctx: IContext,
    @Param('id') dashboardId: string,
    @Body() dto: EditDashboardDto,
  ): Promise<SuccessResponse> {
    const result = await this.dashboardService.editDashboardById(
      ctx,
      dashboardId,
      dto,
    );
    return new SuccessResponse(
      `Success update Dashboard ${result.name}!`,
      result,
    );
  }

  @Delete(':id')
  @Authentication(true)
  @Authorization('dashboards:delete@auth')
  @OtelMethodCounter()
  public async deleteDashboardById(
    @Context() ctx: IContext,
    @Param('id') dashboardId: string,
  ) {
    const result = await this.dashboardService.deleteDashboardById(
      ctx,
      dashboardId,
    );
    return new SuccessResponse(
      `Dashboard: ${result.name} success deleted!`,
      result,
    );
  }
}
