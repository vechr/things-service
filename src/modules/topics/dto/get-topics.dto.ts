import { IsNotEmpty, IsString } from "class-validator";

export class GetTopicsDto {
  @IsString()
  @IsNotEmpty()
  deviceId: string;
}