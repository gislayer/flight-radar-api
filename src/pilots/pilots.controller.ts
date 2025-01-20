import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PilotsService } from './pilots.service';
import { CreatePilotDto, UpdatePilotDto } from './dto/create-pilot.dto';
import { Pilot } from './entities/pilots.entitiy';

@ApiTags('Pilots')
@Controller('pilots')
export class PilotsController {
    constructor(private readonly pilotsService: PilotsService) {}

    @Post()
    @ApiOperation({ summary: 'Yeni pilot oluştur' })
    @ApiResponse({ status: 201, description: 'Pilot başarıyla oluşturuldu', type: Pilot })
    @ApiBody({
        type: CreatePilotDto,
        examples: {
            pilot1: {
                summary: 'Temel pilot örneği',
                value: {
                    name: 'Ali Kilic',
                    settings: {
                        theme: 'dark',
                        notifications: true
                    }
                }
            },
            pilot2: {
                summary: 'Sadece isimli pilot örneği',
                value: {
                    name: 'Ali Kilic'
                }
            }
        }
    })
    create(@Body() createPilotDto: CreatePilotDto) {
        return this.pilotsService.create(createPilotDto);
    }

    @Get()
    @ApiOperation({ summary: 'Tüm pilotları getir' })
    @ApiResponse({ status: 200, description: 'Pilotlar başarıyla getirildi', type: [Pilot] })
    findAll() {
        return this.pilotsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'ID ile pilot getir' })
    @ApiResponse({ status: 200, description: 'Pilot başarıyla getirildi', type: Pilot })
    findOne(@Param('id') id: string) {
        return this.pilotsService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Pilot bilgilerini güncelle' })
    @ApiResponse({ status: 200, description: 'Pilot başarıyla güncellendi', type: Pilot })
    @ApiBody({
        type: UpdatePilotDto,
        examples: {
            update1: {
                summary: 'Tüm alanları güncelleme örneği',
                value: {
                    name: 'Ali Kaya',
                    settings: {
                        theme: 'light',
                        language: 'tr'
                    }
                }
            },
            update2: {
                summary: 'Kısmi güncelleme örneği',
                value: {
                    name: 'Ayşe Yıldız'
                }
            }
        }
    })
    update(@Param('id') id: string, @Body() updatePilotDto: UpdatePilotDto) {
        return this.pilotsService.update(+id, updatePilotDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Pilot sil' })
    @ApiResponse({ status: 200, description: 'Pilot başarıyla silindi' })
    remove(@Param('id') id: string) {
        return this.pilotsService.remove(+id);
    }
}
