import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('airports')
export class Airport {
  @ApiProperty({
    description: 'Havalimanı ID',
    example: 1
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Havalimanı adı',
    example: 'İstanbul Havalimanı'
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Havalimanı konumu (GeoJSON)',
    example: {
      type: 'Point',
      coordinates: [28.7427778, 41.2583333]
    }
  })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326
  })
  geometry: object;
}
