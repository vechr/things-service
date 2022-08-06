import { IsNotEmpty, IsString } from 'class-validator';

export class TopicIdRequestDto {
  @IsString()
  @IsNotEmpty()
  topicId: string;
}
