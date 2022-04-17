import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditDeviceDto {
  @ApiProperty({ example: 'Arduino Uno Room A Edited', description: 'Insert your Device Name in Here!' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Location Arduino Uno in Room A Edited', description: 'Insert your Device Description in Here!' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: false, description: 'Make this true if device still in used!' })
  @IsBoolean()
  @IsNotEmpty()
  isActive?: boolean;

  @ApiProperty({ example: '45019372-0879-4f4b-a644-7aafbab23286', description: 'Attach your Device Type to Device in Here!' })
  @IsString()
  @IsNotEmpty()
  deviceTypeId: string;
}
