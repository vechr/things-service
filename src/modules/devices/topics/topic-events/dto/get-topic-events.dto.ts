import { IsNotEmpty, IsString } from "class-validator";

export class GetTopicEventsDto {
  @IsString()
  @IsNotEmpty()
  topicId: string;
}