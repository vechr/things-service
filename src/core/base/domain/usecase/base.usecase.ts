import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { OtelMethodCounter, Span } from 'nestjs-otel';
import log from '../../frameworks/shared/utils/log.util';
import { IContext } from '../../frameworks/shared/interceptors/context.interceptor';
import {
  EErrorCommonCode,
  UnknownException,
} from '../../frameworks/shared/exceptions/common.exception';
import {
  DropdownEntity,
  IListCursorResult,
  IListPaginationResult,
} from '../entities';
import PrismaService from '../../frameworks/data-services/prisma/prisma.service';
import { BaseRepository } from '../../data/base.repository';
import { Prisma } from '@prisma/client';
import { Audit, AuditList } from '../entities/audit.entity';

/**
 * ## BaseUsecase
 * Collection of CRUD usecase
 * - listDropdown
 * - upsert
 * - create
 * - getById
 * - update
 * - deleteBatch
 * - delete
 * - list pagination
 * - list cursor
 */
export abstract class BaseUseCase<
  Entity extends Record<string, any> = object,
  Include extends Record<string, any> = object,
  Select extends Record<string, any> = object,
  Where extends Record<string, any> = object,
  Create extends Record<string, any> = object,
  CreateMany extends Record<string, any> = object,
  Update extends Record<string, any> = object,
> {
  constructor(
    protected readonly repository: BaseRepository<
      Entity,
      Include,
      Select,
      Where,
      Create,
      CreateMany,
      Update
    >,
    protected db: PrismaService,
  ) {}

  @OtelMethodCounter()
  @Span('usecase list dropdown')
  async listDropdown(ctx: IContext): Promise<DropdownEntity<string, string>[]> {
    try {
      return await this.db.$transaction(async (tx) => {
        return (await this.repository.listDropdown(ctx, tx)).map((val) => ({
          label: val.name,
          value: val.id,
        }));
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during retrieve a simple list!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @OtelMethodCounter()
  @Span('usecase upsert')
  async upsert(
    ctx: IContext,
    body: any,
    include?: Include,
    select?: Select,
    where?: Where,
  ): Promise<Entity> {
    try {
      const create: Create = body;
      const update: Update = body;

      const data = await this.db.$transaction(async (tx) => {
        return await this.repository.upsert(
          true,
          ctx,
          body.name,
          tx,
          create,
          update,
          include,
          select,
          where,
        );
      });

      return data;
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during upsert the data!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @OtelMethodCounter()
  @Span('usecase create')
  async create(ctx: IContext, body: any, include?: Include): Promise<Entity> {
    try {
      const data = await this.db.$transaction(async (tx) => {
        return await this.repository.create(true, ctx, body, tx, include);
      });

      return data;
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during create the data!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @OtelMethodCounter()
  @Span('usecase get')
  async getById(
    _ctx: IContext,
    id: string,
    include?: Include,
  ): Promise<Entity> {
    try {
      const data = await this.db.$transaction(async (tx) => {
        return await this.repository.getById(id, tx, include);
      });

      return data;
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during retrieve the information!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @OtelMethodCounter()
  @Span('usecase update')
  async update(ctx: IContext, id: string, body: any): Promise<Entity> {
    try {
      const data = await this.db.$transaction(async (tx) => {
        return await this.repository.update(true, ctx, id, body, tx);
      });

      return data;
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during change the data!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @OtelMethodCounter()
  @Span('usecase batch delete')
  async deleteBatch(
    _ctx: IContext,
    body: { ids: string[] },
  ): Promise<Prisma.BatchPayload> {
    try {
      return await this.db.$transaction(async (tx) => {
        return await this.repository.deleteBatch(body.ids, tx);
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during delete the datas!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @OtelMethodCounter()
  @Span('usecase delete')
  async delete(
    ctx: IContext,
    id: string,
    include?: Include,
    select?: Select,
    where?: Where,
  ): Promise<Entity> {
    try {
      return await this.db.$transaction(async (tx) => {
        await this.repository.getById(id, tx);
        return await this.repository.delete(
          true,
          ctx,
          id,
          tx,
          include,
          select,
          where,
        );
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during delete the data!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @OtelMethodCounter()
  @Span('usecase list pagination')
  async listPagination(
    ctx: IContext,
    where?: Where,
  ): Promise<IListPaginationResult<Entity>> {
    try {
      return await this.db.$transaction(async (tx) => {
        return this.repository.listPagination(ctx, tx, where);
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during retrieve a list!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  @OtelMethodCounter()
  @Span('usecase list cursor')
  async listCursor(
    ctx: IContext,
    include?: Include,
    where?: Where,
  ): Promise<IListCursorResult<Entity>> {
    try {
      return await this.db.$transaction(async (tx) => {
        return this.repository.listCursor(ctx, tx, include, where);
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during retrieve a list!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  async getAudits(ctx: IContext): Promise<IListPaginationResult<AuditList>> {
    try {
      return await this.db.$transaction(async (tx) => {
        return this.repository.getAudits(ctx, tx);
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during retrieve a list!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  async getAudit(id: string): Promise<Audit | null> {
    try {
      return await this.db.$transaction(async (tx) => {
        return this.repository.getAudit(tx, id);
      });
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: EErrorCommonCode.INTERNAL_SERVER_ERROR,
          message: `Error unexpected during retrieve a list!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
}