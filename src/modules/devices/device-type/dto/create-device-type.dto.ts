import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDeviceTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
