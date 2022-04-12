import { IsOptional, IsString } from 'class-validator';

export class EditDashboardDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
