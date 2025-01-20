import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Point } from 'geojson';
import { Airport } from '../../airports/entities/airports.entitiy';
import { Pilot } from '../../pilots/entities/pilots.entitiy';
import { Aircraft } from '../../aircraft/entities/aircraft.entitiy';

@Entity('routes')
export class Route {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Airport)
    @JoinColumn({ name: 'start_airport_id' })
    start_airport: Airport;

    @ManyToOne(() => Airport)
    @JoinColumn({ name: 'finish_airport_id' })
    finish_airport: Airport;

    @ManyToOne(() => Pilot)
    @JoinColumn({ name: 'pilot_id' })
    pilot: Pilot;

    @ManyToOne(() => Aircraft)
    @JoinColumn({ name: 'aircraft_id' })
    aircraft: Aircraft;

    @CreateDateColumn({default:new Date()})
    last_update_date: Date;

    @Column({ default: false })
    status: boolean;

    @Column({ type: 'float', nullable: true, default: 0 })
    speed: number;

    @Column({ type: 'float', nullable: true, default: 0 }) 
    altitude: number;

    @Column('geometry', {
        spatialFeatureType: 'Point',
        srid: 4326
    })
    point: Point;
}
