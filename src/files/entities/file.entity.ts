// src/files/entities/file.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { FileType } from '../entities/file-type.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  file_name: string;

  @ManyToOne(() => FileType)
  @JoinColumn({ name: 'file_type' })
  fileType: FileType;

  @Column('double precision')
  size: number;

  @Column()
  minio_uuid: string;

  @Column()
  view_count: number;

  @Column()
  download_count: number;

  @Column()
  status: boolean;

  @Column({nullable:true})
  minio_name: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
