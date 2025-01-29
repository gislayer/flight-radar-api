import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeatureCollection, Repository } from 'typeorm';
import { Route } from './entities/routes.entitiy';
import { CreateRouteDto, UpdateRouteDto } from './dto/create-route.dto';
import { Err } from 'src/common/error';
import { Airport } from 'src/airports/entities/airports.entitiy';
import { RouteLog } from './entities/route_logs.entitiy';
import * as turf from '@turf/turf';
import { Point } from 'geojson';

@Injectable()
export class RoutesService {
    private speed = 800;
    private animationCount = 0;
    constructor(
        @InjectRepository(Route)
        private routeRepository: Repository<Route>,
        @InjectRepository(Airport)
        private airportRepository: Repository<Airport>,
        @InjectRepository(RouteLog)
        private routeLogRepository: Repository<RouteLog>
    ) {}

    async create(createRouteDto: CreateRouteDto): Promise<Route> {
        
        var check1 = await this.routeRepository.findOne({
            where: {
                aircraft: {id:createRouteDto.aircraft_id},
                status: true
            }
        });
        if (check1) {
            Err.bad('This aircraft is already in a route.');
        }

        var check2 = await this.routeRepository.findOne({
            where: {
                pilot: { id: createRouteDto.pilot_id },
                status: true
            }
        });
        if (check2) {
            Err.bad('This pilot is already in a route.');
        }

        const route = this.routeRepository.create({
            start_airport: { id: createRouteDto.start_airport_id },
            finish_airport: { id: createRouteDto.finish_airport_id },
            pilot: { id: createRouteDto.pilot_id },
            aircraft: { id: createRouteDto.aircraft_id },
            status: true,
            point: createRouteDto.point
        });
        return await this.routeRepository.save(route);
    }

    async findAll(): Promise<Route[]> {
        return await this.routeRepository.find({
            relations: ['start_airport', 'finish_airport', 'pilot', 'aircraft']
        });
    }

    async getLiveData(bbox:number[]): Promise<FeatureCollection> {
      var aircrafts = await this.routeRepository.createQueryBuilder('route')
        .leftJoinAndSelect('route.aircraft', 'aircraft')
        .where('ST_Intersects(route.point::geometry, ST_MakeEnvelope(:minLng, :minLat, :maxLng, :maxLat, 4326))')
        .setParameters({
          minLng: bbox[0],
          minLat: bbox[1], 
          maxLng: bbox[2],
          maxLat: bbox[3]
        })
        .getMany();
        var geojson:FeatureCollection = {type:'FeatureCollection', features:[]};
        aircrafts.map(aircraft => {
            var properties = {
                id: aircraft.id,
                speed: aircraft.speed,
                bearing: aircraft.bearing,
                altitude: aircraft.altitude,
                type: aircraft.aircraft.aircraftTypeId
            }
            var geometry = aircraft.point;
            geojson.features.push({
                type: 'Feature',
                geometry,
                properties
            });
        })
      return geojson;  
    }

    async findOne(id: number): Promise<Route | null> {
        var data:any = await this.routeRepository.findOne({
            where: { id },
            relations: ['start_airport', 'finish_airport', 'pilot', 'aircraft'],  
        });
        if (!data) {
            Err.bad('Route not found');
        } 
        var route_logs = await this.routeLogRepository.find({
            where: { route: { id } },
            order: {
                id: 'ASC'
            }
        });
        var geojson:FeatureCollection = {type: 'FeatureCollection', features: []};
        for (let i = 0; i < route_logs.length; i++) {
            var properties:any = route_logs[i];
            var geometry = properties.geometry;
            delete properties['geometry'];
            geojson.features.push({
                type: 'Feature',
                geometry,
                properties
            });
        }
        data.path = geojson;
        return data;
    }

    async removeAll(): Promise<void> {
        try {
            await this.routeLogRepository.clear();
            await this.routeRepository.query('TRUNCATE TABLE routes CASCADE');
        } catch (error) {
            Err.bad('Error while removing routes');
        }
    }

    async nextStep(): Promise<void> {
        var speed = 1600;
        var meters = (speed/3600)*2*1000;
        var altitudetrim = 50;
        var bearing_update = await this.routeRepository.query(`
            UPDATE routes r
            SET speed=${speed}, bearing = degrees(ST_Azimuth(
                r.point::geometry,
                (SELECT ST_SetSRID(ST_GeomFromGeoJSON(ST_AsGeoJSON(a.geometry)), 4326)
                 FROM airports a 
                 WHERE a.id = r.finish_airport_id)::geometry
            ))
            WHERE status = true
            RETURNING *;
        `);

        var point_update = await this.routeRepository.query(`
            UPDATE routes r
            SET point = ST_Transform(ST_Project(ST_Transform(r.point, 3857),${meters},radians(r.bearing)),4326)
            WHERE status = true
            RETURNING *;
        `);

        var speed_update = await this.routeRepository.query(`
            WITH route_distances AS (
                SELECT 
                    r.id,
                    r.altitude,
                    ST_Distance(
                        r.point::geography,
                        ST_SetSRID(ST_GeomFromGeoJSON(ST_AsGeoJSON(fa.geometry)), 4326)::geography
                    ) as distance_to_finish
                FROM routes r
                JOIN airports fa ON r.finish_airport_id = fa.id
                WHERE r.status = true
            )
            UPDATE routes r
            SET altitude = 
                CASE
                    WHEN rd.distance_to_finish <= 53280 THEN
                        GREATEST(0, COALESCE(r.altitude, 0) - ${altitudetrim})
                    ELSE
                        LEAST(12000, COALESCE(r.altitude, 0) + ${altitudetrim})
                END
            FROM route_distances rd
            WHERE r.id = rd.id
            AND r.status = true
            RETURNING *;
        `);

        var islem1 = await this.routeRepository.query(`
            INSERT INTO route_logs (route_id, altitude, bearing, speed, date, geometry)
            SELECT id, altitude, bearing, speed, last_update_date, point 
            FROM routes 
            WHERE status = true`);
    }

    async start(): Promise<void> {
        var speed = 800;
        var intervalTiming = 2*1000
        if(this.animationCount !==0) {
            Err.bad('Animation already started');
        }
        this.animationCount++;
        setInterval(async() => {
            if(this.animationCount === 0) {
                return;
            }
            await this.nextStep();

            //var islem2 = await this.routeRepository.query(`UPDATE routes SET status = false WHERE status = true;`);

        }, intervalTiming);
        await this.nextStep();
        
    }

    async generateRoutes(): Promise<void> {
        await this.removeAll();
        var airports = await this.airportRepository.find();
        var airportsObj = {};
        for (let i = 0; i < airports.length; i++) {
            airportsObj[airports[i].id] = airports[i];
        }
        var airports_count = airports.length;
        for (let i = 1; i <= 10000; i++) {
            var random_airport_id = Math.floor(Math.random() * (airports_count - 2) + 2);
            var random_airport_id2 = Math.floor(Math.random() * (airports_count - 2) + 2);
            while (random_airport_id === random_airport_id2) {
                random_airport_id2 = Math.floor(Math.random() * (airports_count - 2) + 2);
            }
            var route = this.routeRepository.create({
                start_airport: { id: random_airport_id },
                finish_airport: { id: random_airport_id2 },
                pilot: { id: i },
                aircraft: { id: i },
                speed:0,
                altitude:0,
                bearing:0,
                status: true,
                point: airportsObj[random_airport_id].geometry
            });
            await this.routeRepository.save(route);
        }
    }

    async update(id: number, updateRouteDto: UpdateRouteDto): Promise<Route | null> {
        const route = await this.routeRepository.preload({
            id,
            start_airport: { id: updateRouteDto.start_airport_id },
            finish_airport: { id: updateRouteDto.finish_airport_id },
            pilot: { id: updateRouteDto.pilot_id },
            aircraft: { id: updateRouteDto.aircraft_id },
            status: updateRouteDto.status,
            point: updateRouteDto.point
        });
        if (!route) {
            return null;
        }
        return await this.routeRepository.save(route);
    }

    async remove(id: number): Promise<void> {
        await this.routeRepository.delete(id);
    }
}
