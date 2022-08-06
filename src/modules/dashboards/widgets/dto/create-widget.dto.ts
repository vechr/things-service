import {
  IsBoolean,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { WidgetType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWidgetDto {
  @ApiProperty({
    example: 'Temp Chart',
    description: 'Insert your Name Widget in Here!',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'This is a temperature Chart',
    description: 'Insert your Description Widget in Here! (optional)',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: {
      content: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      h: 6,
      id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      w: 3,
      x: 12,
      y: 5,
    },
    description: 'Insert your Node Widget in Here!',
  })
  @IsJSON()
  @IsNotEmpty()
  node: string;

  @ApiProperty({
    example: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    description: 'Insert your Node Id of your Widget in Here!',
  })
  @IsString()
  @IsNotEmpty()
  nodeId: string;

  @ApiProperty({
    example: {
      labels: ['Red', 'Blue', 'Yellow'],
      datasets: [
        {
          label: 'Data Example',
          data: [300, 50, 100],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
          ],
          hoverOffset: 4,
        },
      ],
    },
    description: 'Insert your Data Widget in Here!',
  })
  @IsJSON()
  @IsNotEmpty()
  widgetData: string;

  @ApiProperty({
    example: 'DOUGHNUT',
    description:
      'Insert your Type Widget in Here! Can be (BAR, BUBBLE, DOUGHNUT, PIE, GAUGE, LINE, POLAR, RADAR, SCATTER, MAPS)',
  })
  @IsString()
  @IsNotEmpty()
  widgetType: WidgetType;

  @ApiProperty({
    example: false,
    description:
      'Flag for the last data is being saved in Database! (optional)',
  })
  @IsBoolean()
  @IsOptional()
  persistance?: boolean;

  @ApiProperty({
    example: false,
    description: 'Flag for the widget will hide in frontend! (optional)',
  })
  @IsBoolean()
  @IsOptional()
  hidden?: boolean;

  @ApiProperty({
    example: '19e64612-2b72-4d6f-8e1b-e811edafe7e7',
    description: 'Insert your Topic Widget in Here!',
  })
  @IsString()
  @IsNotEmpty()
  topicId: string;
}
