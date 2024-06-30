import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '../../../../core/base/domain/usecase/base.usecase';
import { TopicEvent } from '../entities/topic-event.entity';
import { Prisma } from '@prisma/client';
import { TopicEventRepository } from '../../data/topic-event.repository';
import PrismaService from '@/core/base/frameworks/data-services/prisma/prisma.service';

@Injectable()
export class TopicEventUseCase extends BaseUseCase<
  TopicEvent,
  Prisma.TopicEventInclude,
  Prisma.TopicEventSelect,
  Prisma.TopicEventWhereInput | Prisma.TopicEventWhereUniqueInput,
  Prisma.XOR<
    Prisma.TopicEventCreateInput,
    Prisma.TopicEventUncheckedCreateInput
  >,
  Prisma.TopicEventCreateManyInput[] | Prisma.TopicEventCreateManyInput,
  Prisma.XOR<
    Prisma.TopicEventUpdateInput,
    Prisma.TopicEventUncheckedUpdateInput
  >
> {
  constructor(
    protected repository: TopicEventRepository,
    db: PrismaService,
  ) {
    super(repository, db);
  }
}
