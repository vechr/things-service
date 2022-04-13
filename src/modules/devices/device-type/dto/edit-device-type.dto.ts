import { IsOptional, IsString } from 'class-validator';

export class EditDeviceTypeDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
