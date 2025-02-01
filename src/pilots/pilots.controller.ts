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
    @ApiOperation({ summary: 'Create new pilot' })
    @ApiResponse({ status: 201, description: 'Pilot created successfully', type: Pilot })
    @ApiBody({
        type: CreatePilotDto,
        examples: {
            pilot1: {
                summary: 'Basic pilot example',
                value: {
                    name: 'Ali Kilic',
                    settings: {
                        theme: 'dark',
                        notifications: true
                    }
                }
            },
            pilot2: {
                summary: 'Pilot example with name only',
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
    @ApiOperation({ summary: 'Get all pilots' })
    @ApiResponse({ status: 200, description: 'Pilots retrieved successfully', type: [Pilot] })
    findAll() {
        return this.pilotsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get pilot by ID' })
    @ApiResponse({ status: 200, description: 'Pilot retrieved successfully', type: Pilot })
    findOne(@Param('id') id: string) {
        return this.pilotsService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update pilot information' })
    @ApiResponse({ status: 200, description: 'Pilot updated successfully', type: Pilot })
    @ApiBody({
        type: UpdatePilotDto,
        examples: {
            update1: {
                summary: 'Example of updating all fields',
                value: {
                    name: 'Ali Kaya',
                    settings: {
                        theme: 'light',
                        language: 'tr'
                    }
                }
            },
            update2: {
                summary: 'Example of partial update',
                value: {
                    name: 'Ayse Yildiz'
                }
            }
        }
    })
    update(@Param('id') id: string, @Body() updatePilotDto: UpdatePilotDto) {
        return this.pilotsService.update(+id, updatePilotDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete pilot' })
    @ApiResponse({ status: 200, description: 'Pilot deleted successfully' })
    remove(@Param('id') id: string) {
        return this.pilotsService.remove(+id);
    }
}
