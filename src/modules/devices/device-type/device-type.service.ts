import PrismaService from '@/prisma/prisma.service';
import {
  ForbiddenException,
  NotFoundException,
} from '@/shared/exceptions/common.exception';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateDeviceTypeDto } from './dto/create-device-type.dto';
import { EditDeviceTypeDto } from './dto/edit-device-type.dto';

@Injectable()
export class DeviceTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async getDeviceTypes() {
    return await this.prisma.deviceType.findMany({
      include: {
        devices: true
      }
    });
  }

  async getDeviceTypeById(deviceTypeId: string) {
    const deviceType = await this.prisma.deviceType.findUnique({
      where: {
        id: deviceTypeId,
      },
      include: {
        devices: true
      }
    });

    if (!deviceType) {
      throw new NotFoundException({
        code: HttpStatus.NOT_FOUND.toString(),
        message: 'Device Type is not found!',
      });
    }

    return deviceType;
  }

  async createDeviceType(dto: CreateDeviceTypeDto) {
    const deviceType = await this.prisma.deviceType.create({
      data: {
        ...dto,
      },
      include: {
        devices: true
      }
    });

    return deviceType;
  }

  async editDeviceTypeById(deviceTypeId: string, dto: EditDeviceTypeDto) {
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
        devices: true
      }
    });
  }

  async deleteDeviceTypeById(deviceTypeId: string) {
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
  }
}
