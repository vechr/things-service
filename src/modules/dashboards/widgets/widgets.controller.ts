import SuccessResponse from '@/shared/responses/success.response';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { WidgetService } from './widgets.service';

@ApiTags('Widget')
@Controller('dashboard/:dashboardId/widget')
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  @Get()
  public async getWidgets(
    @Param('dashboardId') dashboardId: string,
  ): Promise<SuccessResponse> {
    const result = await this.widgetService.getWidgets(dashboardId);
    return new SuccessResponse('Success get all record!', result);
  }

  @Post()
  public async createWidget(
    @Param('dashboardId') dashboardId: string,
    @Body() dto: CreateWidgetDto,
  ): Promise<SuccessResponse> {
    const result = await this.widgetService.createWidget(dashboardId, dto);
    return new SuccessResponse('Success create widget!', result);
  }

  @Delete(':id')
  public async deleteWidget(
    @Param('dashboardId') dashboardId: string,
    @Param('id') widgetId: string,
  ): Promise<SuccessResponse> {
    const result = await this.widgetService.deleteWidgetById(
      dashboardId,
      widgetId,
    );
    return new SuccessResponse('Success delete widget!', result);
  }
}
