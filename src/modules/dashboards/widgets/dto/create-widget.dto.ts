import { IsJSON, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
      content: "myChart_9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      h: 6,
      id: "myChart_9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      w: 3,
      x: 12,
      y: 5
    },
    description: 'Insert your Node Widget in Here!',
  })
  @IsJSON()
  @IsNotEmpty()
  node: string;

  @ApiProperty({
    example: {
      labels: [
        'Red',
        'Blue',
        'Yellow'
      ],
      datasets: [{
        label: 'Data Example',
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
    },
    description: 'Insert your Data Widget in Here!',
  })
  @IsJSON()
  @IsNotEmpty()
  widgetData: string;

  @ApiProperty({
    example: 'DOUGHNUT',
    description: 'Insert your Type Widget in Here!',
  })
  @IsString()
  @IsNotEmpty()
  widgetType: WidgetType;

  @ApiProperty({
    example: '19e64612-2b72-4d6f-8e1b-e811edafe7e7',
    description: 'Insert your Topic Widget in Here!',
  })
  @IsString()
  @IsNotEmpty()
  topicId: string;
}

// id                          String @id @default(uuid()) @db.VarChar(36)
//   Dashboard                   Dashboard @relation(fields: [dashboardId], references: [id])
//   dashboardId                 String @db.VarChar(36)
//   name                        String @db.VarChar(50)
//   description                 String? @db.Text()
//   node                        Json?
//   widgetData                  Json?
//   widgetType                  WidgetType
//   topic                       Topic @relation(fields: [topicId], references: [id])
//   topicId                     String @db.VarChar(36)
