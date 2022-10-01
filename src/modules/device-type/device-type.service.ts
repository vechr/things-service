import { HttpStatus, Injectable } from '@nestjs/common';
import { DeviceType } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { CreateDeviceTypeDto } from './dto/create-device-type.dto';
import { EditDeviceTypeDto } from './dto/edit-device-type.dto';
import { TListDeviceTypeRequestQuery } from './requests/list-device-type.request';
import log from '@/shared/utils/log.util';
import {
  ForbiddenException,
  NotFoundException,
  UnknownException,
} from '@/shared/exceptions/common.exception';
import PrismaService from '@/prisma/prisma.service';
import { parseMeta, parseQuery } from '@/shared/utils/query.util';
import { IContext } from '@/shared/interceptors/context.interceptor';

@Injectable()
export class DeviceTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async list(ctx: IContext): Promise<{
    result: DeviceType[];
    meta: { count: number; total: number; page: number; totalPage: number };
  }> {
    const query = ctx.params.query as TListDeviceTypeRequestQuery;

    const { limit, offset, order, page } =
      parseQuery<TListDeviceTypeRequestQuery>(query);

    const selectOptions = {
      orderBy: order,
      where: query.filters.field,
    };

    const pageOptions = {
      take: limit,
      skip: offset,
    };

    const [total, deviceType] = await this.prisma.$transaction([
      this.prisma.deviceType.count(selectOptions),
      this.prisma.deviceType.findMany({
        ...pageOptions,
        ...selectOptions,
        include: { devices: true },
      }),
    ]);

    const meta = parseMeta<DeviceType>({
      result: deviceType,
      total,
      page,
      limit,
    });

    return {
      result: deviceType,
      meta,
    };
  }

  async getDeviceTypes(): Promise<DeviceType[]> {
    try {
      return await this.prisma.deviceType.findMany({
        include: {
          devices: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  async getDeviceTypeById(deviceTypeId: string): Promise<DeviceType> {
    try {
      const deviceType = await this.prisma.deviceType.findUnique({
        where: {
          id: deviceTypeId,
        },
        include: {
          devices: true,
        },
      });

      if (!deviceType) {
        throw new NotFoundException({
          code: HttpStatus.NOT_FOUND.toString(),
          message: 'Device Type is not found!',
        });
      }

      return deviceType;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  async createDeviceType(dto: CreateDeviceTypeDto): Promise<DeviceType> {
    try {
      const checkDeviceType = await this.prisma.deviceType.findUnique({
        where: {
          name: dto.name,
        },
      });

      if (checkDeviceType) {
        throw new ForbiddenException({
          code: HttpStatus.FORBIDDEN.toString(),
          message: 'Device Type already Exists!',
        });
      }

      const deviceType = await this.prisma.deviceType.create({
        data: {
          ...dto,
        },
        include: {
          devices: true,
        },
      });

      return deviceType;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  async editDeviceTypeById(
    deviceTypeId: string,
    dto: EditDeviceTypeDto,
  ): Promise<DeviceType> {
    try {
      const deviceType = await this.prisma.deviceType.findUnique({
        where: {
          id: deviceTypeId,
        },
      });

      if (!deviceType) {
        throw new NotFoundException({
          code: HttpStatus.NOT_FOUND.toString(),
          message: 'Device Type is not found!',
        });
      }

      return this.prisma.deviceType.update({
        where: {
          id: deviceTypeId,
        },
        data: {
          ...dto,
        },
        include: {
          devices: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }

  async deleteDeviceTypeById(deviceTypeId: string): Promise<DeviceType> {
    try {
      const deviceType = await this.prisma.deviceType.findUnique({
        where: {
          id: deviceTypeId,
        },
        include: {
          devices: true,
        },
      });

      if (!deviceType) {
        throw new NotFoundException({
          code: HttpStatus.NOT_FOUND.toString(),
          message: 'Device Type is not found!',
        });
      }

      if (deviceType.devices.length > 0) {
        throw new ForbiddenException({
          code: HttpStatus.FORBIDDEN.toString(),
          message:
            'Device Type contain some devices, you cannot delete this Device Type!',
        });
      }

      const result = await this.prisma.deviceType.delete({
        where: {
          id: deviceTypeId,
        },
        include: {
          devices: true,
        },
      });

      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        log.error(error.message);
        throw new UnknownException({
          code: HttpStatus.INTERNAL_SERVER_ERROR.toString(),
          message: `Error unexpected!`,
          params: { exception: error.message },
        });
      }
      throw error;
    }
  }
}
