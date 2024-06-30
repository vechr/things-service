import { $Enums, Prisma, Widget as TWidget } from '@prisma/client';
import { IListRequestQuery } from '@/core/base/domain/entities';
import { BaseEntity } from '@/core/base/domain/entities';

export class Widget extends BaseEntity implements TWidget {
  dashboardId: string;
  node: Prisma.JsonValue;
  nodeId: string;
  widgetData: Prisma.JsonValue;
  widgetType: $Enums.WidgetType;
  shiftData: boolean | null;
  topicId: string;
}

export type OptionalWidget = Partial<Widget>;
export type RequiredWidget = Required<Widget>;
export type TListWidgetRequestQuery<P> = IListRequestQuery<
  P,
  Widget,
  Prisma.WidgetWhereInput
>;
export type TGetWidgetByIdRequestParams = Pick<Widget, 'id'>;
export type TUpdateWidgetByIdRequestParams = Pick<Widget, 'id'>;
export type TDeleteWidgetByIdRequestParams = Pick<Widget, 'id'>;
export type TCreateWidgetRequestBody = Omit<
  Widget,
  'id' | 'createdAt' | 'updatedAt'
>;
export type TUpsertWidgetRequestBody = TCreateWidgetRequestBody;
export type TUpdateWidgetRequestBody = Partial<TCreateWidgetRequestBody>;
