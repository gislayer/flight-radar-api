import { Module } from '@nestjs/common';
import { AircraftService } from './aircraft.service';
import { AircraftController } from './aircraft.controller';
import { Aircraft } from './entities/aircraft.entitiy';
import { AircraftType } from './entities/aircraft_type.entitiy';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Aircraft, AircraftType])],
  providers: [AircraftService],
  controllers: [AircraftController]
})
export class AircraftModule {}
