import { ApiProperty } from '@nestjs/swagger';
import { Point } from 'geojson';

export class CreateRouteDto {
    @ApiProperty({
        description: 'Başlangıç havalimanı ID',
        example: 2
    })
    start_airport_id: number;

    @ApiProperty({
        description: 'Varış havalimanı ID',
        example: 3
    })
    finish_airport_id: number;

    @ApiProperty({
        description: 'Pilot ID',
        example: 1
    })
    pilot_id: number;

    @ApiProperty({
        description: 'Uçak ID',
        example: 1
    })
    aircraft_id: number;

    @ApiProperty({
        description: 'Rota durumu',
        example: false,
        default: false
    })
    status?: boolean;

    @ApiProperty({
        description: 'Konum noktası',
        example: {
            type: 'Point',
            coordinates: [39.925533, 32.836954] // Örnek koordinatlar: Ankara
        }
    })
    point: Point;
}

export class UpdateRouteDto extends CreateRouteDto {}
