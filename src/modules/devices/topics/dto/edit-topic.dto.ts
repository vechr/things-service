import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EditTopicDto {
  @ApiProperty({
    example: '/temperature/v2',
    description: 'Insert your Topic in Here!',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Temperature Topic from MQTT V2',
    description: 'Insert your Topic in Here!',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
