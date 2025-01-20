import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { File } from '../../files/entities/file.entity';

@Entity('aircraft_type')
export class AircraftType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'img_id', nullable: true })
  imgId: string;

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, any>;

  @ManyToOne(() => File, { nullable: true, eager: true })
  @JoinColumn({ name: 'img_id' })
  image: File;
}
