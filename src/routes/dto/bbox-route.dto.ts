import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class BboxRouteDto {
    @ApiProperty({
        description: 'Bbox koordinatları [minLng, minLat, maxLng, maxLat]',
        type: [Number],
        example: [32.123, 39.123, 33.123, 40.123]
    })
    @IsArray()
    @IsNumber({}, { each: true })
    @ArrayMinSize(4)
    @ArrayMaxSize(4)
    bbox: number[];
}
