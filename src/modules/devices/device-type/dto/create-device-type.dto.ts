import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDeviceTypeDto {
  @ApiProperty({ example: 'Arduino Uno', description: 'Insert your Device Type Name in Here!' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Arduino Uno model R3', description: 'Insert your Device Type Description in Here!' })
  @IsString()
  @IsOptional()
  description?: string;
}
