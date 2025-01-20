import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAircraftDto {
  @ApiProperty({
    description: 'Uçak tipinin ID değeri',
    example: 1,
    type: Number
  })
  @IsNumber()
  aircraftTypeId: number;
}
