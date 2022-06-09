import { ApiProperty } from '@nestjs/swagger';
import { WidgetType } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTopicDto {
  @ApiProperty({
    example: '/temperature',
    description: 'Insert your Topic in Here!',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Temperature Topic from MQTT',
    description: 'Insert your Topic in Here!',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'DOUGHNUT',
    description: 'Insert your Type Widget in Here! Can be (BAR, BUBBLE, DOUGHNUT, PIE, GAUGE, LINE, POLAR, RADAR, SCATTER, MAPS)',
  })
  @IsString()
  @IsOptional()
  widgetType?: WidgetType;
}
