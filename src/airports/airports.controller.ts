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
  @ApiOperation({ summary: 'Yeni havalimanı oluştur' })
  @ApiResponse({ status: 201, description: 'Havalimanı başarıyla oluşturuldu', type: Airport })
  create(@Body() createAirportDto: CreateAirportDto): Promise<Airport> {
    return this.airportsService.create(createAirportDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm havalimanlarını listele' })
  @ApiResponse({ status: 200, description: 'Havalimanları başarıyla listelendi', type: [Airport] })
  findAll(): Promise<Airport[]> {
    return this.airportsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID\'ye göre havalimanı getir' })
  @ApiResponse({ status: 200, description: 'Havalimanı başarıyla getirildi', type: Airport })
  findOne(@Param('id') id: number): Promise<Airport | null> {
    return this.airportsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Havalimanı bilgilerini güncelle' })
  @ApiResponse({ status: 200, description: 'Havalimanı başarıyla güncellendi', type: Airport })
  update(@Param('id') id: number, @Body() updateAirportDto: UpdateAirportDto): Promise<Airport | null> {
    return this.airportsService.update(id, updateAirportDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Havalimanını sil' })
  @ApiResponse({ status: 200, description: 'Havalimanı başarıyla silindi' })
  remove(@Param('id') id: number): Promise<void> {
    return this.airportsService.remove(id);
  }
}
