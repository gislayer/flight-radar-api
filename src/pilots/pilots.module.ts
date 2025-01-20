import { Module } from '@nestjs/common';
import { PilotsService } from './pilots.service';
import { PilotsController } from './pilots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pilot } from './entities/pilots.entitiy';

@Module({
  imports:[TypeOrmModule.forFeature([Pilot])],
  providers: [PilotsService],
  controllers: [PilotsController]
})
export class PilotsModule {}
