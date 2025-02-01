import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AirportsService } from './airports.service';
import { Airport } from './entities/airports.entitiy';
import { CreateAirportDto } from './dto/create-airports.dto';
import { UpdateAirportDto } from './dto/update-airports.dto';

@ApiTags('Airports')
@Controller('airports')
export class AirportsController {
  constructor(private readonly airportsService: AirportsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new airport' })
  @ApiResponse({ status: 201, description: 'Airport created successfully', type: Airport })
  create(@Body() createAirportDto: CreateAirportDto): Promise<Airport> {
    return this.airportsService.create(createAirportDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all airports' })
  @ApiResponse({ status: 200, description: 'Airports listed successfully', type: [Airport] })
  findAll(): Promise<Airport[]> {
    return this.airportsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get airport by ID' })
  @ApiResponse({ status: 200, description: 'Airport retrieved successfully', type: Airport })
  findOne(@Param('id') id: number): Promise<Airport | null> {
    return this.airportsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update airport information' })
  @ApiResponse({ status: 200, description: 'Airport updated successfully', type: Airport })
  update(@Param('id') id: number, @Body() updateAirportDto: UpdateAirportDto): Promise<Airport | null> {
    return this.airportsService.update(id, updateAirportDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete airport' })
  @ApiResponse({ status: 200, description: 'Airport deleted successfully' })
  remove(@Param('id') id: number): Promise<void> {
    return this.airportsService.remove(id);
  }
}
