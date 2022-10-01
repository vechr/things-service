import { HttpStatus, Injectable } from '@nestjs/common';
import { Device } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { CreateDeviceDto } from './dto/create-device.dto';
import { EditDeviceDto } from './dto/edit-device.dto';
import { TListDeviceRequestQuery } from './requests/list-device.request';
import log from '@/shared/utils/log.util';
import {
  ForbiddenException,
  NotFoundException,
  UnknownException,
} from '@/shared/exceptions/common.exception';
import PrismaService from '@/prisma/prisma.service';
import { IContext } from '@/shared/interceptors/context.interceptor';
import { parseMeta, parseQuery } from '@/shared/utils/query.util';

@Injectable()
export class DeviceService {
  constructor(private readonly prisma: PrismaService) {}

  async list(ctx: IContext): Promise<{
    result: Device[];
    meta: { count: number; total: number; page: number; totalPage: number };
  }> {
    const query = ctx.params.query as TListDeviceRequestQuery;

    const { limit, offset, order, page } =
      parseQuery<TListDeviceRequestQuery>(query);

    const selectOptions = {
      orderBy: order,
      where: query.filters.field,
    };

    const pageOptions = {
      take: limit,
      skip: offset,
    };

    const [total, device] = await this.prisma.$transaction([
      this.prisma.device.count(selectOptions),
      this.prisma.device.findMany({
        ...pageOptions,
        ...selectOptions,
        include: {
          topics: true,
          deviceType: true,
        },
      }),
    ]);

    const meta = parseMeta<Device>({
      result: device,
      total,
      page,
      limit,
    });

    return {
      result: device,
      meta,
    };
  }

  async getDevices(): Promise<Device[]> {
    try {
      const result = await this.prisma.device.findMany({
        include: {
          topics: true,
          deviceType: true,
        },
      });

      const filter = result.map((device) => {
        return {
          ...device,
          topics: device.topics.map((topic) => ({
            id: topic.id,
            name: topic.name,
            description: topic.description,
          })),
        };
      });

      return filter;
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

  async getDeviceById(deviceId: string): Promise<Record<string, any>> {
    try {
      const device = await this.prisma.device.findUnique({
        where: {
          id: deviceId,
        },
        include: {
          topics: true,
          deviceType: true,
        },
      });

      if (!device) {
        throw new NotFoundException({
          code: HttpStatus.NOT_FOUND.toString(),
          message: 'Device is not found!',
        });
      }

      const filter = device.topics.map((topic) => topic);

      const response = {
        id: device.id,
        name: device.name,
        description: device.description,
        createdAt: device.createdAt,
        updatedAt: device.updatedAt,
        deviceType: device.deviceType,
        isActive: device.isActive,
        topics: filter,
      };

      return response;
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

  async createDevice(dto: CreateDeviceDto) {
    try {
      const checkDevice = await this.prisma.device.findUnique({
        where: {
          name: dto.name,
        },
      });

      if (checkDevice) {
        throw new ForbiddenException({
          code: HttpStatus.FORBIDDEN.toString(),
          message: 'Device already Exists!',
        });
      }

      const deviceType = await this.prisma.deviceType.findUnique({
        where: {
          id: dto.deviceTypeId,
        },
      });

      if (!deviceType) {
        throw new NotFoundException({
          code: HttpStatus.NOT_FOUND.toString(),
          message: 'Device Type is not found!',
        });
      }

      const device = await this.prisma.device.create({
        data: {
          ...dto,
        },
        include: {
          deviceType: true,
          topics: true,
        },
      });

      return device;
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

  async editDeviceById(deviceId: string, dto: EditDeviceDto) {
    try {
      const device = await this.prisma.device.findUnique({
        where: {
          id: deviceId,
        },
      });

      if (!device) {
        throw new NotFoundException({
          code: HttpStatus.NOT_FOUND.toString(),
          message: 'Device is not found!',
        });
      }

      const deviceType = await this.prisma.deviceType.findUnique({
        where: {
          id: dto.deviceTypeId,
        },
      });

      if (!deviceType) {
        throw new NotFoundException({
          code: HttpStatus.NOT_FOUND.toString(),
          message: 'Device Type is not found!',
        });
      }

      return this.prisma.device.update({
        where: {
          id: deviceId,
        },
        data: {
          ...dto,
        },
        include: {
          deviceType: true,
          topics: true,
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

  async deleteDeviceById(deviceId: string) {
    try {
      const device = await this.prisma.device.findUnique({
        where: {
          id: deviceId,
        },
        include: {
          topics: true,
        },
      });

      if (!device) {
        throw new NotFoundException({
          code: HttpStatus.NOT_FOUND.toString(),
          message: 'Device is not found!',
        });
      }

      if (device.topics.length > 0) {
        throw new ForbiddenException({
          code: HttpStatus.FORBIDDEN.toString(),
          message: 'Device contain some topic, you cannot delete this device!',
        });
      }

      await this.prisma.device.update({
        where: {
          id: deviceId,
        },
        data: {
          dashboards: {
            deleteMany: {},
          },
        },
      });

      const result = await this.prisma.device.delete({
        where: {
          id: deviceId,
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
