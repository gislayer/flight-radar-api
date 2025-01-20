import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from './entities/routes.entitiy';
import { Airport } from 'src/airports/entities/airports.entitiy';
import { RouteLog } from './entities/route_logs.entitiy';

@Module({
  imports: [TypeOrmModule.forFeature([Route, Airport, RouteLog])],
  providers: [RoutesService],
  controllers: [RoutesController]
})
export class RoutesModule {}
