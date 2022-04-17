import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { IDashboardConnectDevice } from './dashboard-connect-device.interface';

export class EditDashboardDto {
  @ApiProperty({
    example: 'Dashboard A being Edit',
    description: 'Insert your Dashboard Name in Here that you want edit!',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'This is Dashboard A is being Edit',
    description:
      'Insert your Dashboard Description in Here that you want edit!',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: [
      { id: '32fed155-1eba-4461-8918-04bcacf1762d' },
      { id: 'c55a05aa-2b2f-4ff4-b7b5-eb048a2cd27f' },
    ],
    description: 'You can attach device into this dashboard!',
  })
  @IsArray()
  devices: IDashboardConnectDevice[];
}
