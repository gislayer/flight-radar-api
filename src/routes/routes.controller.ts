import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RoutesService } from './routes.service';
import { CreateRouteDto, UpdateRouteDto } from './dto/create-route.dto';
import { Route } from './entities/routes.entitiy';

@ApiTags('Routes')
@Controller('routes')
export class RoutesController {
    constructor(private readonly routesService: RoutesService) {}

    @Post()
    @ApiOperation({ summary: 'Yeni rota oluştur' })
    @ApiResponse({ status: 201, description: 'Rota başarıyla oluşturuldu', type: Route })
    @ApiBody({
        type: CreateRouteDto,
        examples: {
            route1: {
                summary: 'Temel rota örneği',
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
    @ApiOperation({ summary: 'Tüm rotaları getir' })
    @ApiResponse({ status: 200, description: 'Rotalar başarıyla getirildi', type: [Route] })
    findAll() {
        return this.routesService.findAll();
    }

    @Get('/remove')
    @ApiOperation({ summary: 'ID ile rota getir' })
    @ApiResponse({ status: 200, description: 'Rota başarıyla getirildi', type: Route })
    removeAll() {
        return this.routesService.removeAll();
    }

    @Get('/generate')
    @ApiOperation({ summary: 'Rotaları oluştur' })
    @ApiResponse({ status: 200, description: 'Rotalar başarıyla oluşturuldu' })
    generateRoutes() {
        return this.routesService.generateRoutes();
    }

    @Get(':id')
    @ApiOperation({ summary: 'ID ile rota getir' })
    @ApiResponse({ status: 200, description: 'Rota başarıyla getirildi', type: Route })
    findOne(@Param('id') id: string) {
        return this.routesService.findOne(+id);
    }

    

    @Put(':id')
    @ApiOperation({ summary: 'Rota bilgilerini güncelle' })
    @ApiResponse({ status: 200, description: 'Rota başarıyla güncellendi', type: Route })
    @ApiBody({
        type: UpdateRouteDto,
        examples: {
            update1: {
                summary: 'Rota güncelleme örneği',
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
    @ApiOperation({ summary: 'Rota sil' })
    @ApiResponse({ status: 200, description: 'Rota başarıyla silindi' })
    remove(@Param('id') id: string) {
        return this.routesService.remove(+id);
    }
}
