import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationEmailUseCase } from '../domain/usecase/notification-email.usecase';
import {
  CreateNotificationEmailSerializer,
  DeleteNotificationEmailSerializer,
  GetNotificationEmailSerializer,
  ListNotificationEmailSerializer,
  UpdateNotificationEmailSerializer,
  UpsertNotificationEmailSerializer,
} from '@/modules/notification-emails/domain/entities/notification-email.serializer';
import {
  CreateNotificationEmailValidator,
  DeleteNotificationEmailBatchBodyValidator,
  DeleteNotificationEmailParamsValidator,
  FilterCursorNotificationEmailQueryValidator,
  FilterPaginationNotificationEmailQueryValidator,
  GetNotificationEmailParamsValidator,
  ListCursorNotificationEmailQueryValidator,
  ListPaginationNotificationEmailQueryValidator,
  UpdateNotificationEmailParamsValidator,
  UpdateNotificationEmailValidator,
  UpsertNotificationEmailValidator,
} from '@/modules/notification-emails/domain/entities/notification-email.validator';
import { ControllerFactory } from '@/core/base/infrastructure/factory.controller';
import { OtelInstanceCounter } from 'nestjs-otel';

@ApiTags('NotificationEmail')
@OtelInstanceCounter()
@Controller('notification-email')
export class NotificationEmailController extends ControllerFactory<
  UpsertNotificationEmailValidator,
  CreateNotificationEmailValidator,
  GetNotificationEmailParamsValidator,
  UpdateNotificationEmailValidator,
  UpdateNotificationEmailParamsValidator,
  DeleteNotificationEmailBatchBodyValidator,
  DeleteNotificationEmailParamsValidator
>(
  'notification-email',
  'notification-email',
  FilterPaginationNotificationEmailQueryValidator,
  FilterCursorNotificationEmailQueryValidator,
  ListNotificationEmailSerializer,
  ListPaginationNotificationEmailQueryValidator,
  ListCursorNotificationEmailQueryValidator,
  UpsertNotificationEmailSerializer,
  UpsertNotificationEmailValidator,
  CreateNotificationEmailSerializer,
  CreateNotificationEmailValidator,
  GetNotificationEmailSerializer,
  GetNotificationEmailParamsValidator,
  UpdateNotificationEmailSerializer,
  UpdateNotificationEmailValidator,
  UpdateNotificationEmailParamsValidator,
  DeleteNotificationEmailSerializer,
  DeleteNotificationEmailBatchBodyValidator,
  DeleteNotificationEmailParamsValidator,
) {
  constructor(public _usecase: NotificationEmailUseCase) {
    super();
  }
}
