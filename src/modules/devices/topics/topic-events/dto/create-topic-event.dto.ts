import { IsJSON, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTopicEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsJSON()
  @IsOptional()
  eventExpression?: string;

  @IsString()
  @IsNotEmpty()
  topicId: string;
}