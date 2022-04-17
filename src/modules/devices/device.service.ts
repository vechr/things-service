import PrismaService from '@/prisma/prisma.service';
import { NotFoundException } from '@/shared/exceptions/common.exception';
import SuccessResponse from '@/shared/responses/success.response';
import { Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { EditDeviceDto } from './dto/edit-device.dto';

@Injectable()
export class DeviceService {
  constructor(private readonly prisma: PrismaService) {}

  async getDevices() {
    const result = await this.prisma.device.findMany({
      include: {
        topics: true
      }
    })

    const filter = result.map((device) => {
      return {...device, topics: device.topics.map((topic) => ({id: topic.id, name: topic.name, description: topic.description}))};
    })

    return filter;
  }

  async getDeviceById(deviceId: string) {
    const device = await this.prisma.device.findUnique({
      where: {
        id: deviceId,
      },
    });

    if (!device) {
      throw new NotFoundException({
        code: '404',
        message: 'Device is not found!',
      });
    }

    return device;
  }

  async createDevice(dto: CreateDeviceDto) {
    const deviceType = await this.prisma.deviceType.findUnique({
      where: {
        id: dto.deviceTypeId,
      },
    });

    if (!deviceType) {
      throw new NotFoundException({
        code: '404',
        message: 'Device Type is not found!',
      });
    }

    const device = await this.prisma.device.create({
      data: {
        ...dto,
      },
    });

    return device;
  }

  async editDeviceById(deviceId: string, dto: EditDeviceDto) {
    const device = await this.prisma.device.findUnique({
      where: {
        id: deviceId,
      },
    });

    if (!device) {
      throw new NotFoundException({
        code: '404',
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
        code: '404',
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
    });
  }

  async deleteDeviceById(deviceId: string) {
    const device = await this.prisma.device.findUnique({
      where: {
        id: deviceId,
      },
    });

    if (!device) {
      throw new NotFoundException({
        code: '404',
        message: 'Device is not found!',
      });
    }

    const result = await this.prisma.device.delete({
      where: {
        id: deviceId,
      },
    });

    return new SuccessResponse(`Device: ${deviceId} success deleted!`, result);
  }
}
