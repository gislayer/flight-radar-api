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
  @ApiOperation({ summary: 'Yeni uçak oluştur' })
  @ApiResponse({ status: 201, description: 'Uçak başarıyla oluşturuldu', type: Aircraft })
  create(@Body() createAircraftDto: CreateAircraftDto) {
    return this.aircraftService.create(createAircraftDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm uçakları listele' })
  @ApiResponse({ status: 200, description: 'Uçaklar başarıyla listelendi', type: [Aircraft] })
  findAll() {
    return this.aircraftService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID\'ye göre uçak getir' })
  @ApiResponse({ status: 200, description: 'Uçak başarıyla getirildi', type: Aircraft })
  findOne(@Param('id') id: string) {
    return this.aircraftService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Uçak bilgilerini güncelle' })
  @ApiResponse({ status: 200, description: 'Uçak başarıyla güncellendi', type: Aircraft })
  update(@Param('id') id: string, @Body() updateAircraftDto: UpdateAircraftDto) {
    return this.aircraftService.update(+id, updateAircraftDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Uçak sil' })
  @ApiResponse({ status: 200, description: 'Uçak başarıyla silindi' })
  remove(@Param('id') id: string) {
    return this.aircraftService.remove(+id);
  }
}
