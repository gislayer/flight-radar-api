import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Point } from 'geojson';
import { Route } from './routes.entitiy';

@Entity('route_logs')
export class RouteLog {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Route)
    @JoinColumn({ name: 'route_id' })
    route: Route;

    @Column({ type: 'float', nullable: true, default: 0 })
    altitude: number;

    @Column({ type: 'float', nullable: true, default: 0 })
    bearing: number;

    @Column({ type: 'float', nullable: true, default: 0 })
    speed: number;

    @Column('geometry', {
        spatialFeatureType: 'Point',
        srid: 4326
    })
    geometry: Point;

    @CreateDateColumn()
    date: Date;
}
