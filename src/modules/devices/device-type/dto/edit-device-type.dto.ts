import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EditDeviceTypeDto {
  @ApiProperty({
    example: 'Arduino Uno Edited',
    description: 'Insert your Device Type Name in Here!',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    example: 'Arduino Uno model R3 Edited',
    description: 'Insert your Device Type Description in Here!',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
