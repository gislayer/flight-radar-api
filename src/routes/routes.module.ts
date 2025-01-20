import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from './entities/routes.entitiy';
import { Airport } from 'src/airports/entities/airports.entitiy';

@Module({
  imports: [TypeOrmModule.forFeature([Route, Airport])],
  providers: [RoutesService],
  controllers: [RoutesController]
})
export class RoutesModule {}
