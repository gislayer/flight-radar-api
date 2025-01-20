import { IsString, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateAirportDto {
    @ApiProperty({
      description: 'Havalimanı adı',
      example: 'İstanbul Havalimanı',
      type: String
    })
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @ApiProperty({
        description: 'Havalimanı konumu (EPSG:4326)',
        example: {"type": "Point", "coordinates": [28.7427778, 41.2583333]},
        type: String
      })
      @IsObject()
      @IsNotEmpty()
      geometry: object;
  }