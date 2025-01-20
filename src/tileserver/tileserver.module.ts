import { Module } from '@nestjs/common';
import { TileserverController } from './tileserver.controller';
import { TileserverService } from './tileserver.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aircraft } from 'src/aircraft/entities/aircraft.entitiy';

@Module({
    imports: [TypeOrmModule.forFeature([Aircraft])],
  controllers: [TileserverController],
  providers: [TileserverService]
})
export class TileserverModule {}
