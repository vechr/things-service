import { Cache } from 'cache-manager';
import { IContext } from '../frameworks/shared/interceptors/context.interceptor';
import {
  IListCursorResult,
  IListPaginationResult,
  TPrismaTx,
} from '../domain/entities';
import { camelize } from '../frameworks/shared/utils/string.util';
import { DeleteHelper, ReadHelper, WriteHelper } from './helpers';
import { Prisma } from '@prisma/client';
import { Audit, AuditList } from '../domain/entities/audit.entity';

/**
 * ## BaseRepository
 * Collection of basic CRUD methods
 * - listDropdown
 * - upsert
 * - create
 * - createMany
 * - update
 * - delete
 * - deleteBatch
 * - get
 * - getMany
 * - listCursor
 * - listPagination
 * - getAudits
 * - getAudit
 */
export abstract class BaseRepository<
  Entity extends Record<string, any>,
  Include extends Record<string, any>,
  Select extends Record<string, any>,
  Where extends Record<string, any>,
  Create extends Record<string, any>,
  CreateMany extends Record<string, any>,
  Update extends Record<string, any>,
> {
  protected _entity: string;
  protected cacheManager: Cache;

  public defaultInclude: Include;
  public defaultSelect: Select;
  public defaultWhere: Where;

  constructor(entity: new () => Entity, cacheManager: Cache) {
    this._entity = camelize(entity.name);
    this.cacheManager = cacheManager;
  }

  async listDropdown(
    ctx: IContext,
    tx: TPrismaTx,
  ): Promise<Pick<Entity, 'id' | 'name'>[]> {
    return ReadHelper.listDropDown<Entity>(ctx, tx, this._entity);
  }

  async upsert(
    isAudited: boolean,
    ctx: IContext,
    name: string,
    tx: TPrismaTx,
    create: Create,
    update: Update,
    include?: Include,
    select?: Select,
    where?: Where,
  ): Promise<Entity> {
    return await WriteHelper.upsert<
      Entity,
      Create,
      Update,
      Include,
      Select,
      Where
    >(
      isAudited,
      ctx,
      name,
      tx,
      this._entity,
      create,
      update,
      include ? include : this.defaultInclude,
      select ? select : this.defaultSelect,
      where ? where : this.defaultWhere,
    );
  }

  async create(
    isAudited: boolean,
    ctx: IContext,
    body: Create,
    tx: TPrismaTx,
    include?: Include,
    select?: Select,
  ): Promise<Entity> {
    return WriteHelper.create<Entity, Create, Include, Select>(
      isAudited,
      ctx,
      body,
      tx,
      this._entity,
      this.cacheManager,
      include ? include : this.defaultInclude,
      select ? select : this.defaultSelect,
    );
  }

  async createMany(body: any, tx: TPrismaTx): Promise<Prisma.BatchPayload> {
    return WriteHelper.createMany<CreateMany>(body, tx, this._entity);
  }

  async update(
    isAudited: boolean,
    ctx: IContext,
    id: string,
    body: Update,
    tx: TPrismaTx,
    include?: Include,
    select?: Select,
    where?: Where,
  ): Promise<Entity> {
    return WriteHelper.update<Entity, Update, Include, Select, Where>(
      isAudited,
      ctx,
      id,
      body,
      tx,
      this._entity,
      this.cacheManager,
      include ? include : this.defaultInclude,
      select ? select : this.defaultSelect,
      where ? where : this.defaultWhere,
    );
  }

  async delete(
    isAudited: boolean,
    ctx: IContext,
    id: string,
    tx: TPrismaTx,
    include?: Include,
    select?: Select,
    where?: Where,
  ): Promise<Entity> {
    return DeleteHelper.delete<Entity, Include, Select, Where>(
      isAudited,
      ctx,
      id,
      tx,
      this._entity,
      this.cacheManager,
      include ? include : this.defaultInclude,
      select ? select : this.defaultSelect,
      where ? where : this.defaultWhere,
    );
  }

  async deleteBatch(
    ids: string[],
    tx: TPrismaTx,
    where?: Where,
  ): Promise<Prisma.BatchPayload> {
    return DeleteHelper.deleteBatch(
      ids,
      tx,
      this._entity,
      this.cacheManager,
      where ? where : this.defaultWhere,
    );
  }

  async getById(
    id: string,
    tx: TPrismaTx,
    include?: Include,
    select?: Select,
  ): Promise<Entity> {
    return ReadHelper.getById<Entity, Include, Select>(
      id,
      tx,
      this._entity,
      this.cacheManager,
      include ? include : this.defaultInclude,
      select ? select : this.defaultSelect,
    );
  }

  async get(
    tx: TPrismaTx,
    where?: Where,
    include?: Include,
    select?: Select,
  ): Promise<Entity> {
    return ReadHelper.get<Entity, Include, Select, Where>(
      tx,
      this._entity,
      include ? include : this.defaultInclude,
      select ? select : this.defaultSelect,
      where ? where : this.defaultWhere,
    );
  }

  async getMany(
    tx: TPrismaTx,
    include?: Include,
    select?: Select,
    where?: Where,
  ): Promise<Entity[]> {
    return ReadHelper.getMany<Entity, Include, Select, Where>(
      tx,
      this._entity,
      include ? include : this.defaultInclude,
      select ? select : this.defaultSelect,
      where ? where : this.defaultWhere,
    );
  }

  async listCursor(
    ctx: IContext,
    tx: TPrismaTx,
    include?: Include,
    where?: Where,
  ): Promise<IListCursorResult<Entity>> {
    return ReadHelper.listCursor<Entity, Include, Where>(
      ctx,
      tx,
      this._entity,
      include ? include : this.defaultInclude,
      where ? where : this.defaultWhere,
    );
  }

  async listPagination(
    ctx: IContext,
    tx: TPrismaTx,
    where?: Where,
  ): Promise<IListPaginationResult<Entity>> {
    return ReadHelper.listPagination<Entity, Where>(
      ctx,
      tx,
      this._entity,
      where ? where : this.defaultWhere,
    );
  }

  async getAudits(
    ctx: IContext,
    tx: TPrismaTx,
  ): Promise<IListPaginationResult<AuditList>> {
    return ReadHelper.listPaginationWithInclude<
      AuditList,
      Prisma.AuditWhereInput | Prisma.AuditWhereUniqueInput,
      Prisma.AuditSelect
    >(
      ctx,
      tx,
      'audit',
      {
        auditable: this._entity,
      },
      {
        id: true,
        changeCount: true,
        action: true,
        username: true,
        createdAt: true,
      },
    );
  }

  async getAudit(tx: TPrismaTx, id: string): Promise<Audit | null> {
    return await tx.audit.findUnique({
      where: {
        id,
      },
    });
  }
}
