import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"


export class DBLoggerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '8ae24fe4-f1e9-4a6d-8768-df10d8240a68', description: 'Input your dashboardId in here' })
  dashboardId: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '1c789647-440d-4ff0-8584-0b85ae566c1c', description: 'Input your deviceId in here' })
  deviceId: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '0b17a38d-4d03-4c8c-9ef4-d36b8601b571', description: 'Input your topicId in here' })
  topicId: string

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '/topicA', description: 'Input your topic name in here' })
  topic: string
}