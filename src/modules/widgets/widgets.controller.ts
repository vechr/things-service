import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { WidgetService } from './widgets.service';
import SuccessResponse from '@/shared/responses/success.response';
import Authentication from '@/shared/decorators/authentication.decorator';
import Authorization from '@/shared/decorators/authorization.decorator';
import Context from '@/shared/decorators/context.decorator';
import { IContext } from '@/shared/interceptors/context.interceptor';

@ApiTags('Widget')
@ApiBearerAuth('access-token')
@Controller('things/dashboard/:dashboardId/widget')
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  @Get()
  @Authentication(true)
  @Authorization('widgets:read@auth')
  public async getWidgets(
    @Param('dashboardId') dashboardId: string,
  ): Promise<SuccessResponse> {
    const result = await this.widgetService.getWidgets(dashboardId);
    return new SuccessResponse('Success get all record!', result);
  }

  @Post()
  @Authentication(true)
  @Authorization('widgets:create@auth')
  public async createWidget(
    @Context() ctx: IContext,
    @Param('dashboardId') dashboardId: string,
    @Body() dto: CreateWidgetDto,
  ): Promise<SuccessResponse> {
    const result = await this.widgetService.createWidget(ctx, dashboardId, dto);
    return new SuccessResponse('Success create widget!', result);
  }

  @Delete(':id')
  @Authentication(true)
  @Authorization('widgets:delete@auth')
  public async deleteWidgetId(
    @Context() ctx: IContext,
    @Param('dashboardId') dashboardId: string,
    @Param('id') widgetId: string,
  ): Promise<SuccessResponse> {
    const result = await this.widgetService.deleteWidgetById(
      ctx,
      dashboardId,
      widgetId,
    );
    return new SuccessResponse('Success delete widget!', result);
  }

  @Patch(':id')
  @Authentication(true)
  @Authorization('widgets:update@auth')
  public async editWidgetById(
    @Context() ctx: IContext,
    @Param('dashboardId') dashboardId: string,
    @Param('id') widgetId: string,
    @Body() dto: UpdateWidgetDto,
  ): Promise<SuccessResponse> {
    const result = await this.widgetService.editWidgetById(
      ctx,
      dashboardId,
      dto,
      widgetId,
    );
    return new SuccessResponse('Success update widget!', result);
  }
}
