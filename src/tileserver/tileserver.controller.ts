import { Controller, Get, Param } from '@nestjs/common';
import { TileserverService } from './tileserver.service';

@Controller('tileserver')
export class TileserverController {
    constructor(private readonly tileserverService: TileserverService) {}

    @Get('last/:z/:x/:y.pbf')
    async getLastTile(
        @Param('z') z: number,
        @Param('x') x: number, 
        @Param('y') y: number
    ) {
        var tile = await this.tileserverService.getTile(z, x, y);
        return tile;
    }

}
