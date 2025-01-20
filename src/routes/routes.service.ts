import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Route } from './entities/routes.entitiy';
import { CreateRouteDto, UpdateRouteDto } from './dto/create-route.dto';
import { Err } from 'src/common/error';
import { Airport } from 'src/airports/entities/airports.entitiy';

@Injectable()
export class RoutesService {
    constructor(
        @InjectRepository(Route)
        private routeRepository: Repository<Route>,
        @InjectRepository(Airport)
        private airportRepository: Repository<Airport>
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
