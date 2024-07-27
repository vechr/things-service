import { IBubble, IMaps, IScatter } from '../entities';
import log from '@/core/base/frameworks/shared/utils/log.util';
import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';

@Injectable()
export class ChartUseCase {
  validation(widgetType: string, data: string): boolean {
    try {
      if (
        widgetType === $Enums.WidgetType.BAR ||
        widgetType === $Enums.WidgetType.DOUGHNUT ||
        widgetType === $Enums.WidgetType.GAUGE ||
        widgetType === $Enums.WidgetType.LINE ||
        widgetType === $Enums.WidgetType.PIE ||
        widgetType === $Enums.WidgetType.POLAR ||
        widgetType === $Enums.WidgetType.RADAR
      ) {
        const result = Number(data);
        if (Number.isNaN(result)) {
          log.error("Data wouldn't be store, since type is different");
          return false;
        }
      } else if (widgetType === $Enums.WidgetType.SCATTER) {
        if (!this.isScatter(JSON.parse(data))) {
          log.error("Data wouldn't be store, since type is not Scatter");
          return false;
        }
      } else if (widgetType === $Enums.WidgetType.BUBBLE) {
        if (!this.isBubble(JSON.parse(data))) {
          log.error("Data wouldn't be store, since type is not Bubble");
          return false;
        }
      } else if (widgetType === $Enums.WidgetType.MAPS) {
        if (!this.isMaps(JSON.parse(data))) {
          log.error("Data wouldn't be store, since type is not Maps");
          return false;
        }
      }

      return true;
    } catch (error) {
      log.error(`${error}`);
      return false;
    }
  }

  private isScatter(data: any): data is IScatter {
    return 'x' in data && 'y' in data;
  }

  private isBubble(data: any): data is IBubble {
    return 'x' in data && 'y' in data && 'r' in data;
  }

  private isMaps(data: any): data is IMaps {
    return 'latitude' in data && 'longitude' in data;
  }
}
