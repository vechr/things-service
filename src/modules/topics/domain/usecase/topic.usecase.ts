import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '../../../../core/base/domain/usecase/base.usecase';
import { Topic } from '../entities/topic.entity';
import { Prisma } from '@prisma/client';
import { TopicRepository } from '../../data/topic.repository';
import PrismaService from '@/core/base/frameworks/data-services/prisma/prisma.service';
import { TraceService } from 'nestjs-otel';

@Injectable()
export class TopicUseCase extends BaseUseCase<
  Topic,
  Prisma.TopicInclude,
  Prisma.TopicSelect,
  Prisma.TopicWhereInput | Prisma.TopicWhereUniqueInput,
  Prisma.XOR<Prisma.TopicCreateInput, Prisma.TopicUncheckedCreateInput>,
  Prisma.TopicCreateManyInput[] | Prisma.TopicCreateManyInput,
  Prisma.XOR<Prisma.TopicUpdateInput, Prisma.TopicUncheckedUpdateInput>
> {
  constructor(
    protected repository: TopicRepository,
    db: PrismaService,
    traceService: TraceService,
  ) {
    super(repository, db, traceService);
  }
}
