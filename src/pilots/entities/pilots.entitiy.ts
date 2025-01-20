import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pilot {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:false})
    name: string;

    @Column('jsonb',{nullable:true})
    settings: Record<string, any>;
}
