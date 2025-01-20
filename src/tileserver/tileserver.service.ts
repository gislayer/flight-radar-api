import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Aircraft } from 'src/aircraft/entities/aircraft.entitiy';
import { Repository } from 'typeorm';

@Injectable()
export class TileserverService {
    private tileIndex: any;
    private lastUpdate: number;

    constructor(
        @InjectRepository(Aircraft)
        readonly repo: Repository<Aircraft>
    ) {
    }



    private async updateTileIndex() {
        const result = await this.repo.query(
            'select r.id,st_asgeojson(r.point) as geometry, a.aircraft_type_id as type, r.altitude, r.speed from routes r,aircraft a where r.status=true and a.id=r.aircraft_id'
        );

        const geojson = {
            type: 'FeatureCollection',
            features: result.map(item => ({
                type: 'Feature',
                geometry: JSON.parse(item.geometry),
                properties: {
                    id: item.id,
                    type: item.type,
                    altitude: item.altitude,
                    speed: item.speed
                }
            }))
        };

        return geojson;
    }

    async getTile(z: number, x: number, y: number): Promise<boolean> {
        /*if (Date.now() - this.lastUpdate > 2000) {
            await this.updateTileIndex();
        }

        const tile = this.tileIndex.getTile(z, x, y);
        
        if (!tile) {
            return Buffer.alloc(0);
        }

        const pbf = vtpbf.fromGeojsonVt({ routes: tile });
        return Buffer.from(pbf);*/
        return true;
    }
}
