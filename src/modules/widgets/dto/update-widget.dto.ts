import { IsBoolean, IsJSON, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWidgetDto {
  @ApiProperty({
    example: 'Temp Chart',
    description: 'Insert your Name Widget in Here! (optional)',
  })
  @IsString()
  @IsOptional()
  name?: string;

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
    description: 'Insert your Node Widget in Here! (optional)',
  })
  @IsJSON()
  @IsOptional()
  node?: string;

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
    description: 'Insert your Data Widget in Here! (optional)',
  })
  @IsJSON()
  @IsOptional()
  widgetData?: string;

  @ApiProperty({
    example: false,
    description: 'Flag for whether data it will be shifted or not! (optional)',
  })
  @IsBoolean()
  @IsOptional()
  shiftData?: boolean;
}
