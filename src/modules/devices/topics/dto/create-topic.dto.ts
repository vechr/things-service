import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTopicDto {
  @ApiProperty({ example: '/temperature', description: 'Insert your Topic in Here!' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Temperature Topic from MQTT', description: 'Insert your Topic in Here!' })
  @IsString()
  @IsOptional()
  description?: string;
}