import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '../../../../core/base/domain/usecase/base.usecase';
import {
  NotificationEmail,
  TCreateNotificationEmailRequestBody,
  TUpdateNotificationEmailRequestBody,
  TUpsertNotificationEmailRequestBody,
} from '../entities/notification-email.entity';
import { Prisma } from '@prisma/client';
import { NotificationEmailRepository } from '../../data/notification-email.repository';
import PrismaService from '@/core/base/frameworks/data-services/prisma/prisma.service';
import { OtelMethodCounter, Span, TraceService } from 'nestjs-otel';
import { IContext } from '@/core/base/frameworks/shared/interceptors/context.interceptor';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import log from '@/core/base/frameworks/shared/utils/log.util';
import {
  EErrorCommonCode,
  UnknownException,
} from '@/core/base/frameworks/shared/exceptions/common.exception';

@Injectable()
export class NotificationEmailUseCase extends BaseUseCase<
  NotificationEmail,
  Prisma.NotificationEmailInclude,
  Prisma.NotificationEmailSelect,
  Prisma.NotificationEmailWhereInput | Prisma.NotificationEmailWhereUniqueInput,
  Prisma.XOR<
    Prisma.NotificationEmailCreateInput,
    Prisma.NotificationEmailUncheckedCreateInput
  >,
  | Prisma.NotificationEmailCreateManyInput[]
  | Prisma.NotificationEmailCreateManyInput,
  Prisma.XOR<
    Prisma.NotificationEmailUpdateInput,
    Prisma.NotificationEmailUncheckedUpdateInput
  >
> {
  constructor(
    protected repository: NotificationEmailRepository,
    db: PrismaService,
    traceService: TraceService,
  ) {
    super(repository, db, traceService);
  }

  @OtelMethodCounter()
  @Span('usecase create notification emails')
  override async upsert(
    ctx: IContext,
    body: TUpsertNotificationEmailRequestBody,
  ): Promise<NotificationEmail> {
    const span = this.traceService.getSpan();
    try {
      const result = await this.db.$transaction(async (tx) => {
        const create: Prisma.NotificationEmailCreateInput = {
          description: body.description,
          name: body.name,
          topicEvents: {
            create: body.topicEvents.map((topicEvent) => ({
              topicEvent: { connect: { id: topicEvent } },
            })),
          },
          sender: body.sender,
          recipient: body.recipient,
        };

        const update: Prisma.NotificationEmailUpdateInput = {
          description: body.description,
          name: body.name,
          topicEvents: {
            create: body.topicEvents.map((topicEvent) => ({
              topicEvent: { connect: { id: topicEvent } },
            })),
          },
          sender: body.sender,
          recipient: body.recipient,
        };

        span?.addEvent('store the notification emails data');
        return await this.repository.upsert(
          true,
          ctx,
          body.name,
          tx,
          create,
          update,
        );
      });

      span?.setStatus({ code: 1, message: 'usecase finish!' });
      return result;
    } catch (error: any) {
      span?.setStatus({ code: 2, message: error.message });
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during create a notification emails!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @OtelMethodCounter()
  @Span('usecase create notification emails')
  override async create(
    ctx: IContext,
    body: TCreateNotificationEmailRequestBody,
  ): Promise<NotificationEmail> {
    const span = this.traceService.getSpan();
    try {
      const result = await this.db.$transaction(async (tx) => {
        span?.addEvent('create body notification emails');
        const bodyModified: Prisma.NotificationEmailCreateInput = {
          description: body.description,
          name: body.name,
          topicEvents: {
            create: body.topicEvents.map((topicEvent) => ({
              topicEvent: { connect: { id: topicEvent } },
            })),
          },
          sender: body.sender,
          recipient: body.recipient,
        };

        span?.addEvent('store the body data');
        return await this.repository.create(true, ctx, bodyModified, tx);
      });

      span?.setStatus({ code: 1, message: 'usecase finish!' });
      return result;
    } catch (error: any) {
      span?.setStatus({ code: 2, message: error.message });
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during create a notification emails!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @OtelMethodCounter()
  @Span('usecase update notification emails')
  override async update(
    ctx: IContext,
    id: string,
    body: TUpdateNotificationEmailRequestBody,
  ): Promise<NotificationEmail> {
    const span = this.traceService.getSpan();
    try {
      const result = await this.db.$transaction(async (tx) => {
        await this.repository.getById(id, tx);

        const bodyModified: Prisma.NotificationEmailUpdateInput = {
          description: body.description,
          name: body.name,
          topicEvents: {
            deleteMany: {},
            create: body.topicEvents?.map((topicEvent) => ({
              topicEvent: { connect: { id: topicEvent } },
            })),
          },
          sender: body.sender,
          recipient: body.recipient,
        };

        span?.addEvent('store the notification emails data');
        return await this.repository.update(true, ctx, id, bodyModified, tx);
      });

      span?.setStatus({ code: 1, message: 'usecase finish!' });
      return result;
    } catch (error: any) {
      span?.setStatus({ code: 2, message: error.message });
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during change a notification emails!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
}
