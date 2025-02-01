import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AircraftService } from './aircraft.service';
import { CreateAircraftDto } from './dto/create-aircraft.dto';
import { UpdateAircraftDto } from './dto/update-aircraft.dto';
import { Aircraft } from './entities/aircraft.entitiy';

@ApiTags('Aircrafts')
@Controller('aircraft')
export class AircraftController {
  constructor(private readonly aircraftService: AircraftService) {}

  @Post()
  @ApiOperation({ summary: 'Create new aircraft' })
  @ApiResponse({ status: 201, description: 'Aircraft created successfully', type: Aircraft })
  create(@Body() createAircraftDto: CreateAircraftDto) {
    return this.aircraftService.create(createAircraftDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all aircrafts' })
  @ApiResponse({ status: 200, description: 'Aircrafts listed successfully', type: [Aircraft] })
  findAll() {
    return this.aircraftService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get aircraft by ID' })
  @ApiResponse({ status: 200, description: 'Aircraft retrieved successfully', type: Aircraft })
  findOne(@Param('id') id: string) {
    return this.aircraftService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update aircraft information' })
  @ApiResponse({ status: 200, description: 'Aircraft updated successfully', type: Aircraft })
  update(@Param('id') id: string, @Body() updateAircraftDto: UpdateAircraftDto) {
    return this.aircraftService.update(+id, updateAircraftDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete aircraft' })
  @ApiResponse({ status: 200, description: 'Aircraft deleted successfully' })
  remove(@Param('id') id: string) {
    return this.aircraftService.remove(+id);
  }
}
