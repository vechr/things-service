import { ApiProperty } from "@nestjs/swagger";
import { IsJSON, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTopicEventDto {
  @ApiProperty({ example: 'Event Temperature Max', description: 'Insert your Topic Event Name in Here!' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Event when Temperature get Maximum', description: 'Insert your Topic Event Description in Here!' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: {key: 100}, description: 'Insert your Expression in Here!' })
  @IsJSON()
  @IsOptional()
  eventExpression?: string;
}