// src/files/files.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { File } from './entities/file.entity';
import { FileType } from './entities/file-type.entity';
import { MinioModule } from 'src/minio/minio.module';

@Module({
  imports: [TypeOrmModule.forFeature([File, FileType]),MinioModule],
  providers: [FilesService],
  controllers: [FilesController],
  exports: [FilesService]
})
export class FilesModule {}
