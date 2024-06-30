// import { HttpStatus, Inject, Injectable } from '@nestjs/common';
// import { ClientNats } from '@nestjs/microservices';
// import { Topic } from '@prisma/client';
// import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
// import { lastValueFrom } from 'rxjs';
// import { StringCodec } from 'nats';
// import { NatsjsSubscriber } from '../services/natsjs/natsjs.subscriber';
// import AuditService from '../audits/audit.service';
// import { AuditAction } from '../audits/types/audit-enum.type';
// import { DBLoggerDto, QueryCreateEventDto } from './dto';
// import { CreateTopicDto } from './dto/create-topic.dto';
// import { EditTopicDto } from './dto/edit-topic.dto';
// import {
//   TListTopicRequestQuery,
//   TTopicRequestParams,
// } from './requests/list-topic.request';
// import log from '@/shared/utils/log.util';
// import {
//   ForbiddenException,
//   NotFoundException,
//   UnknownException,
// } from '@/shared/exceptions/common.exception';
// import PrismaService from '@/prisma/prisma.service';
// import { IContext } from '@/shared/interceptors/context.interceptor';
// import { parseMeta, parseQuery } from '@/shared/utils/query.util';
// import { Auditable } from '@/shared/types/auditable.type';

// @Injectable()
// export class TopicService {
//   constructor(
//     private readonly prisma: PrismaService,
//     @Inject('NATS_SERVICE') private readonly dbLoggerClient: ClientNats,
//     private readonly natsjsSubscriber: NatsjsSubscriber,
//     private readonly auditService: AuditService,
//   ) {}

//   async list(ctx: IContext): Promise<{
//     result: Topic[];
//     meta: { count: number; total: number; page: number; totalPage: number };
//   }> {
//     const query = ctx.params.query as TListTopicRequestQuery;
//     const params = ctx.params.params as TTopicRequestParams;

//     const { limit, offset, order, page } =
//       parseQuery<TListTopicRequestQuery>(query);

//     const selectOptions = {
//       orderBy: order,
//       where: { ...query.filters.field, deviceId: params.deviceId },
//     };

//     const pageOptions = {
//       take: limit,
//       skip: offset,
//     };

//     const [total, topic] = await this.prisma.$transaction([
//       this.prisma.topic.count(selectOptions),
//       this.prisma.topic.findMany({
//         ...pageOptions,
//         ...selectOptions,
//         include: { topicEvents: true },
//       }),
//     ]);

//     const meta = parseMeta<Topic>({
//       result: topic,
//       total,
//       page,
//       limit,
//     });

//     return {
//       result: topic,
//       meta,
//     };
//   }

//   async getDataTopic(dto: DBLoggerDto) {
//     const source = this.dbLoggerClient.send(
//       'getData.query',
//       new QueryCreateEventDto(
//         dto.dashboardId,
//         dto.deviceId,
//         dto.topicId,
//         dto.topic,
//       ),
//     );
//     return await lastValueFrom(source);
//   }

//   async getTopics(deviceId: string): Promise<Topic[]> {
//     try {
//       const result = await this.prisma.topic.findMany({
//         where: {
//           deviceId,
//         },
//         include: {
//           topicEvents: true,
//         },
//       });

//       const filter = result.map((topic) => {
//         return {
//           ...topic,
//           topicEvents: topic.topicEvents.map((topicEvents) => topicEvents),
//         };
//       });

//       return filter;
//     } catch (error) {
//       if (error instanceof PrismaClientKnownRequestError) {
//         log.error(error.message);
//         throw new UnknownException({
//           code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
//           message: `Error unexpected!`,
//           params: { exception: error.message },
//         });
//       }
//       throw error;
//     }
//   }

//   async getTopicWidget(topicId: string): Promise<void> {
//     const result = await this.getTopicById(topicId);
//     await this.natsjsSubscriber.kv.put(
//       result.id,
//       StringCodec().encode(JSON.stringify(result)),
//     );
//   }

//   async getTopicById(topicId: string): Promise<Topic> {
//     try {
//       const topic = await this.prisma.topic.findUnique({
//         where: {
//           id: topicId,
//         },
//         include: {
//           topicEvents: true,
//         },
//       });

//       if (!topic) {
//         throw new NotFoundException({
//           code: HttpStatus.NOT_FOUND.toString(),
//           message: 'Topic is not found!',
//         });
//       }

//       return topic;
//     } catch (error) {
//       if (error instanceof PrismaClientKnownRequestError) {
//         log.error(error.message);
//         throw new UnknownException({
//           code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
//           message: `Error unexpected!`,
//           params: { exception: error.message },
//         });
//       }
//       throw error;
//     }
//   }

//   async createTopic(
//     ctx: IContext,
//     deviceId: string,
//     { name, description, widgetType }: CreateTopicDto,
//   ): Promise<Topic> {
//     try {
//       const device = await this.prisma.device.findUnique({
//         where: {
//           id: deviceId,
//         },
//       });

//       if (!device) {
//         throw new NotFoundException({
//           code: HttpStatus.NOT_FOUND.toString(),
//           message: 'Device is not found!',
//         });
//       }

//       const topic = await this.prisma.topic.create({
//         data: {
//           name,
//           description,
//           widgetType,
//           deviceId,
//         },
//         include: {
//           topicEvents: true,
//         },
//       });

//       await this.natsjsSubscriber.kv.put(
//         topic.id,
//         StringCodec().encode(JSON.stringify(topic)),
//       );

//       await this.auditService.sendAudit(ctx, AuditAction.CREATED, {
//         id: topic.id,
//         incoming: topic,
//         auditable: Auditable.TOPIC,
//       });

//       return topic;
//     } catch (error) {
//       if (error instanceof PrismaClientKnownRequestError) {
//         log.error(error.message);
//         throw new UnknownException({
//           code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
//           message: `Error unexpected!`,
//           params: { exception: error.message },
//         });
//       }
//       throw error;
//     }
//   }

//   async editTopicById(
//     ctx: IContext,
//     deviceId: string,
//     topicId: string,
//     { name, description }: EditTopicDto,
//   ): Promise<Topic> {
//     try {
//       const topic = await this.prisma.topic.findUnique({
//         where: {
//           id: topicId,
//         },
//         include: {
//           topicEvents: true,
//         },
//       });

//       if (!topic) {
//         throw new NotFoundException({
//           code: HttpStatus.NOT_FOUND.toString(),
//           message: 'Topic is not found!',
//         });
//       }

//       const device = await this.prisma.device.findUnique({
//         where: {
//           id: deviceId,
//         },
//       });

//       if (!device) {
//         throw new NotFoundException({
//           code: HttpStatus.NOT_FOUND.toString(),
//           message: 'Device is not found!',
//         });
//       }

//       const topicUpdated = await this.prisma.topic.update({
//         where: {
//           id: topicId,
//         },
//         data: {
//           name,
//           description,
//           deviceId,
//         },
//         include: {
//           topicEvents: true,
//         },
//       });

//       await this.natsjsSubscriber.kv.put(
//         topicUpdated.id,
//         StringCodec().encode(JSON.stringify(topicUpdated)),
//       );

//       await this.auditService.sendAudit(ctx, AuditAction.UPDATED, {
//         id: topicUpdated.id,
//         prev: topic,
//         incoming: topicUpdated,
//         auditable: Auditable.TOPIC,
//       });

//       return topicUpdated;
//     } catch (error) {
//       if (error instanceof PrismaClientKnownRequestError) {
//         log.error(error.message);
//         throw new UnknownException({
//           code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
//           message: `Error unexpected!`,
//           params: { exception: error.message },
//         });
//       }
//       throw error;
//     }
//   }

//   async deleteTopicById(ctx: IContext, topicId: string) {
//     try {
//       const topic = await this.prisma.topic.findUnique({
//         where: {
//           id: topicId,
//         },
//         include: {
//           topicEvents: true,
//         },
//       });

//       if (!topic) {
//         throw new NotFoundException({
//           code: HttpStatus.NOT_FOUND.toString(),
//           message: 'Topic is not found!',
//         });
//       }

//       if (topic.topicEvents.length > 0) {
//         throw new ForbiddenException({
//           code: HttpStatus.FORBIDDEN.toString(),
//           message:
//             'Topic contain some topic event, you cannot delete this Topic!',
//         });
//       }

//       const result = await this.prisma.topic.delete({
//         where: {
//           id: topicId,
//         },
//         include: {
//           topicEvents: true,
//         },
//       });

//       await this.natsjsSubscriber.kv.purge(result.id);

//       await this.auditService.sendAudit(ctx, AuditAction.DELETED, {
//         id: result.id,
//         prev: result,
//         auditable: Auditable.TOPIC,
//       });

//       return result;
//     } catch (error) {
//       if (error instanceof PrismaClientKnownRequestError) {
//         log.error(error.message);
//         throw new UnknownException({
//           code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
//           message: `Error unexpected!`,
//           params: { exception: error.message },
//         });
//       }
//       throw error;
//     }
//   }
// }
