import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDashboardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
