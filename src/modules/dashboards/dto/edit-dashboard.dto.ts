import { IsArray, IsOptional, IsString } from 'class-validator';
import { IDashboardConnectDevice } from './dashboard-connect-device.interface';

export class EditDashboardDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  devices: IDashboardConnectDevice[];
}
