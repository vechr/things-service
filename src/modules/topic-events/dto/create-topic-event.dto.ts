import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTopicEventDto {
  @ApiProperty({
    example: 'Event Temperature Max',
    description: 'Insert your Topic Event Name in Here!',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Event when Temperature get Maximum',
    description: 'Insert your Topic Event Description in Here!',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: { key: 100 },
    description: 'Insert your Expression in Here!',
  })
  @IsJSON()
  @IsOptional()
  eventExpression?: string;

  @ApiProperty({
    example: [
      'de2d547a-2601-11ed-861d-0242ac120002',
      'e7207a94-2601-11ed-861d-0242ac120002',
    ],
    description: 'Insert your notification Email ID in here',
  })
  @IsArray()
  @IsOptional()
  notificationEmailId: string[];

  @ApiProperty({
    example: 'Hello this is body email',
    description:
      'Email text body that will be send when expression is triggered',
  })
  @IsString()
  @IsOptional()
  bodyEmail: string;

  @ApiProperty({
    example: '<h1>Hello this is body email</h1>',
    description:
      'Email html body that will be send when expression is triggered',
  })
  @IsString()
  @IsOptional()
  htmlBodyEmail: string;
}
