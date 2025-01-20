import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from './entities/routes.entitiy';
import { CreateRouteDto, UpdateRouteDto } from './dto/create-route.dto';
import { Err } from 'src/common/error';
import { Airport } from 'src/airports/entities/airports.entitiy';
import { RouteLog } from './entities/route_logs.entitiy';

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

    async findOne(id: number): Promise<Route | null> {
        return await this.routeRepository.findOne({
            where: { id },
            relations: ['start_airport', 'finish_airport', 'pilot', 'aircraft']
        });
    }

    async removeAll(): Promise<void> {
        await this.routeRepository.clear();
    }

    async start(): Promise<void> {
        var speed = 800;
        var intervalTiming = 2*1000
        if(this.animationCount !==0) {
            Err.bad('Animation already started');
        }
        this.animationCount++;
        setTimeout(async() => {
            if(this.animationCount === 0) {
                return;
            }
            var islem1 = await this.routeRepository.query(`
                INSERT INTO route_logs (route_id, altitude, bearing, speed, date, geometry)
                SELECT id, altitude, bearing, speed, last_update_date, point 
                FROM routes 
                WHERE status = true`);
            var islem2 = await this.routeRepository.query(`UPDATE routes SET status = false WHERE status = true;`);

            var islem3 = await this.routeRepository.query(`
                WITH route_info AS (
                    SELECT 
                        r.id,
                        r.point as start_point,
                        ST_SetSRID(ST_GeomFromGeoJSON(ST_AsGeoJSON(a.geometry)), 4326) as end_point,
                        ST_Length(ST_MakeLine(r.point, ST_SetSRID(ST_GeomFromGeoJSON(ST_AsGeoJSON(a.geometry)), 4326))::geography) as total_distance,
                        ${speed/3600*intervalTiming/1000} as distance_to_move
                    FROM routes r
                    JOIN airports a ON r.finish_airport_id = a.id
                    WHERE r.status = false
                ),
                calculated_points AS (
                    SELECT 
                        id,
                        start_point,
                        end_point,
                        total_distance,
                        distance_to_move,
                        ST_SetSRID(ST_LineInterpolatePoint(
                            ST_MakeLine(start_point::geometry, end_point::geometry), 
                            LEAST(distance_to_move / total_distance, 1)
                        ), 4326) as new_point,
                        degrees(ST_Azimuth(start_point::geometry, end_point::geometry)) as bearing,
                        (distance_to_move / total_distance) * 100 as progress_percent
                    FROM route_info
                )
                UPDATE routes r
                SET 
                    point = cp.new_point::geometry,
                    bearing = cp.bearing,
                    speed = ${speed},
                    altitude = CASE 
                        WHEN cp.progress_percent <= 25 THEN 11000 * (cp.progress_percent / 25)
                        WHEN cp.progress_percent > 75 THEN 11000 * ((100 - cp.progress_percent) / 25)
                        ELSE 11000
                    END,
                    status = CASE 
                        WHEN cp.distance_to_move >= cp.total_distance THEN false 
                        ELSE true 
                    END,
                    last_update_date = NOW()
                FROM calculated_points cp
                WHERE r.id = cp.id
                AND r.status = false`);
        }, intervalTiming);
        
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
