import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AircraftType } from './aircraft_type.entitiy';

@Entity('aircraft')
export class Aircraft {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name:'name',nullable:true})
  name: string;

  @Column({ name: 'aircraft_type_id' })
  aircraftTypeId: number;

  @ManyToOne(() => AircraftType, {eager:true})
  @JoinColumn({ name: 'aircraft_type_id' })
  aircraftType: AircraftType;
}
