import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDashboardDto {
  @ApiProperty({ example: 'Dashboard A', description: 'Insert your Dashboard Name in Here' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'This is Dashboard A', description: 'Insert your Dashboard Description in Here' })
  @IsString()
  @IsOptional()
  description?: string;
}
