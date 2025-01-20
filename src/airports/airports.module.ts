import { Module } from '@nestjs/common';
import { AirportsService } from './airports.service';
import { AirportsController } from './airports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airport } from './entities/airports.entitiy';

@Module({
  imports: [TypeOrmModule.forFeature([Airport])],
  providers: [AirportsService],
  controllers: [AirportsController]
})
export class AirportsModule {}
