import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsOptional, IsString } from 'class-validator';

export class EditTopicEventDto {
  @ApiProperty({
    example: 'Event Temperature Max Edited',
    description: 'Insert your Topic Event Name in Here!',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Event when Temperature get Maximum Edited',
    description: 'Insert your Topic Event Description in Here!',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: { key: 120 },
    description: 'Insert your Expression in Here!',
  })
  @IsJSON()
  @IsOptional()
  eventExpression?: string;
}
