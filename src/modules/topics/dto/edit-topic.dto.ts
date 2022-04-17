import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditTopicDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  deviceId: string;
}
