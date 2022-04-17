import { IsJSON, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class EditTopicEventDto {
  @IsString()
  @IsOptional()
  name?: string;

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