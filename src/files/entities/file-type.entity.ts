// src/files/entities/file-type.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('file_types')
export class FileType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  extension: string;

  @Column()
  mimetype: string;

  @Column()
  format: string;

  @Column({default:307200})
  maxsize: number;

  @Column({default:true})
  accepted: boolean;
}
