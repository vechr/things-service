import PrismaService from '@/prisma/prisma.service';
import { NotFoundException } from '@/shared/exceptions/common.exception';
import SuccessResponse from '@/shared/responses/success.response';
import { Injectable } from '@nestjs/common';
import { CreateDeviceTypeDto } from './dto/create-device-type.dto';
import { EditDeviceTypeDto } from './dto/edit-device-type.dto';

@Injectable()
export class DeviceTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async getDeviceTypes() {
    return await this.prisma.deviceType.findMany();
  }

  async getDeviceTypeById(deviceTypeId: string) {
    const deviceType = await this.prisma.deviceType.findUnique({
      where: {
        id: deviceTypeId,
      },
    });

    if (!deviceType) {
      throw new NotFoundException({
        code: '404',
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
        code: '404',
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
    });
  }

  async deleteDeviceTypeById(deviceTypeId: string) {
    const deviceType = await this.prisma.deviceType.findUnique({
      where: {
        id: deviceTypeId,
      },
    });

    if (!deviceType) {
      throw new NotFoundException({
        code: '404',
        message: 'Device Type is not found!',
      });
    }

    const result = await this.prisma.deviceType.delete({
      where: {
        id: deviceTypeId,
      },
    });

    return new SuccessResponse(
      `Device Type: ${deviceTypeId} success deleted!`,
      result,
    );
  }
}
