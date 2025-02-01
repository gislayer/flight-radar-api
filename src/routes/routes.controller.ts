import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RoutesService } from './routes.service';
import { CreateRouteDto, UpdateRouteDto } from './dto/create-route.dto';
import { Route } from './entities/routes.entitiy';
import { BboxRouteDto } from './dto/bbox-route.dto';

@ApiTags('Routes')
@Controller('routes')
export class RoutesController {
    constructor(private readonly routesService: RoutesService) {}

    @Post()
    @ApiOperation({ summary: 'Create new route' })
    @ApiResponse({ status: 201, description: 'Route created successfully', type: Route })
    @ApiBody({
        type: CreateRouteDto,
        examples: {
            route1: {
                summary: 'Basic route example',
                value: {
                    start_airport_id: 1,
                    finish_airport_id: 2,
                    pilot_id: 1,
                    aircraft_id: 1,
                    status: false,
                    point: {
                        type: 'Point',
                        coordinates: [39.925533, 32.836954]
                    }
                }
            }
        }
    })
    create(@Body() createRouteDto: CreateRouteDto) {
        return this.routesService.create(createRouteDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all routes' })
    @ApiResponse({ status: 200, description: 'Routes retrieved successfully', type: [Route] })
    findAll() {
        return this.routesService.findAll();
    }

    @Get('jobs/remove')
    @ApiOperation({ summary: 'Get route by ID' })
    @ApiResponse({ status: 200, description: 'Route retrieved successfully', type: Route })
    removeAll() {
        return this.routesService.removeAll();
    }

    @Get('jobs/generate')
    @ApiOperation({ summary: 'Generate routes' })
    @ApiResponse({ status: 200, description: 'Routes generated successfully' })
    generateRoutes() {
        return this.routesService.generateRoutes();
    }

    @Get('jobs/next')
    @ApiOperation({ summary: 'Next View' })
    @ApiResponse({ status: 200, description: 'Routes generated successfully' })
    nextRoutes() {
        return this.routesService.nextStep();
    }

    @Get('jobs/start')
    @ApiOperation({ summary: 'Get route logs' })
    @ApiResponse({ status: 200, description: 'Route logs retrieved successfully' })
    getLogs() {
        return this.routesService.start();
    }

    @Post('jobs/live')
    @ApiOperation({ summary: 'Get live data' })
    @ApiResponse({ status: 200, description: 'Route logs retrieved successfully' })
    getLiveData(@Body() data: BboxRouteDto) {
        return this.routesService.getLiveData(data.bbox);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get route by ID' })
    @ApiResponse({ status: 200, description: 'Route retrieved successfully', type: Route })
    findOne(@Param('id') id: string) {
        return this.routesService.findOne(+id);
    }

    

    @Put(':id')
    @ApiOperation({ summary: 'Update route information' })
    @ApiResponse({ status: 200, description: 'Route updated successfully', type: Route })
    @ApiBody({
        type: UpdateRouteDto,
        examples: {
            update1: {
                summary: 'Route update example',
                value: {
                    start_airport_id: 2,
                    finish_airport_id: 3,
                    pilot_id: 2,
                    aircraft_id: 2,
                    status: true,
                    point: {
                        type: 'Point',
                        coordinates: [41.015137, 28.979530]
                    }
                }
            }
        }
    })
    update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto) {
        return this.routesService.update(+id, updateRouteDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete route' })
    @ApiResponse({ status: 200, description: 'Route deleted successfully' })
    remove(@Param('id') id: string) {
        return this.routesService.remove(+id);
    }
}
