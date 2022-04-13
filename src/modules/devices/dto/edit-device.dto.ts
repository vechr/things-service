import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditDeviceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsNotEmpty()
  isActive?: boolean;

  @IsString()
  @IsNotEmpty()
  deviceTypeId: string;
}
