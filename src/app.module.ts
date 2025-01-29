import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from './files/files.module';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto'; // crypto modülünü ekleyelim
import { AircraftModule } from './aircraft/aircraft.module';
import { AirportsModule } from './airports/airports.module';
import { PilotsModule } from './pilots/pilots.module';
import { RoutesModule } from './routes/routes.module';
import { TileserverModule } from './tileserver/tileserver.module';
import { WebsocketModule } from './websocket/websocket.module';

const generateString = () => uuidv4();

@Module({
  imports: [
    CacheModule.register({
      ttl:3600,
      max:100,
      isGlobal:true
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: parseInt(configService.get('DATABASE_PORT') || '5432'),
        username: configService.get('DATABASE_USERNAME'), 
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
        logging: process.env.NODE_ENV === 'development'
      }),
      inject: [ConfigService],
    }),
    FilesModule,
    AircraftModule,
    AirportsModule,
    PilotsModule,
    RoutesModule,
    TileserverModule,
    WebsocketModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    
  }
}