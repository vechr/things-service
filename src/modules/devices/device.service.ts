import PrismaService from '@/prisma/prisma.service';
import {
  ForbiddenException,
  NotFoundException,
} from '@/shared/exceptions/common.exception';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { EditDeviceDto } from './dto/edit-device.dto';

@Injectable()
export class DeviceService {
  constructor(private readonly prisma: PrismaService) {}

  async getDevices() {
    const result = await this.prisma.device.findMany({
      include: {
        topics: true,
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
  }

  async getDeviceById(deviceId: string) {
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
      topics: filter,
    };

    return response;
  }

  async createDevice(dto: CreateDeviceDto) {
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
    });
  }

  async deleteDeviceById(deviceId: string) {
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

    const result = await this.prisma.device.delete({
      where: {
        id: deviceId,
      },
    });

    return result;
  }
}
