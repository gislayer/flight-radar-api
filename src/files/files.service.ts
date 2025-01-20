// src/files/files.service.ts
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { MinioService } from 'src/minio/minio.service';
import DOMPurify from 'dompurify'; 
import { JSDOM } from 'jsdom';
import { FileType } from './entities/file-type.entity';
import { Err } from '../common/error';
const uuidv4 = require('uuid').v4;

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(FileType)
    private readonly fileTypeRepository: Repository<FileType>,
    private readonly minioService: MinioService,
  ) {}

  sanitizeSvg(svgContent: string): string {
    const window = new JSDOM('').window;
    const purify = DOMPurify(window);
    const cleanSvg = purify.sanitize(svgContent, { USE_PROFILES: { svg: true, svgFilters: true } });
    return cleanSvg;
  }

  sanitizeXml(xmlContent: string): string {
    const window = new JSDOM('').window;
    const purify = DOMPurify(window);
    const cleanXml = purify.sanitize(xmlContent, { USE_PROFILES: { html: false } });
    return cleanXml;
  }

  sanitizeKml(kmlContent: string): string {
    const window = new JSDOM('').window;
    const purify = DOMPurify(window);
    const cleanKml = purify.sanitize(kmlContent, { USE_PROFILES: { html: false } });
    return cleanKml;
  }

  async create(file: Express.Multer.File, createFileDto: CreateFileDto, forceAccept?:boolean): Promise<File> {
    if(!file){
      Err.bad('File has not been uploaded');
    }
    const bucketName = 'main';
    var fileNameUUID = uuidv4();
    if(file.originalname=='blob'){
      file.filename = createFileDto.name;
      file.originalname = createFileDto.name;
    }
    createFileDto.file_name=file.originalname;
    var mimetype = file.mimetype.toLocaleLowerCase();
    var extension = 'png';
    var isOkType = await this.fileTypeRepository.findOne({where:{extension:extension}});
    var xmlChecks = ['svg','xml','kml'];
    let bufferToUpload = file.buffer;
    if(xmlChecks.indexOf(extension)!==-1){
      let sanitizedContent: string;
      if (file.mimetype === 'image/svg+xml') {
        sanitizedContent = this.sanitizeSvg(file.buffer.toString());
      } else if (file.mimetype === 'application/xml') {
        sanitizedContent = this.sanitizeXml(file.buffer.toString());
      } else if (file.mimetype === 'application/vnd.google-earth.kml+xml') {
        sanitizedContent = this.sanitizeKml(file.buffer.toString());
      } else {
        throw new Error('Unsupported file type');
      }
      bufferToUpload = Buffer.from(sanitizedContent);
    }
    if(!isOkType){
        throw new BadRequestException(`Forbiden ${extension}(${mimetype}) format!`);
    }
    if((forceAccept==undefined || forceAccept==false) && isOkType.accepted==false){
        throw new BadRequestException(`Forbiden ${extension}(${mimetype}) not allowed anymore!`);
    }
    if(isOkType.maxsize<bufferToUpload.length){
        throw new BadRequestException(`File must be low 300kb`);
    }
    createFileDto.size=bufferToUpload.length;
    createFileDto.view_count=0;
    createFileDto.download_count=0; 
    createFileDto.status=true; 
    createFileDto.fileType = isOkType;
    createFileDto.minio_name=`${fileNameUUID}.${extension}`;
    file.filename = createFileDto.minio_name;
    file.originalname = createFileDto.minio_name;
    await this.minioService.createBucket(bucketName);
    const etag = await this.minioService.uploadFile({ ...file, buffer: bufferToUpload }, bucketName);

    // Dosya bilgilerini veritabanına kaydetme
    const fileRecord = this.fileRepository.create({
      ...createFileDto,
      minio_uuid: etag,
    });
    return this.fileRepository.save(fileRecord);
  }

  async findAll(): Promise<File[]> {
    return this.fileRepository.find({order:{id:'DESC'}});
  }

  

  async findOne(id: number): Promise<File> {
    const file = await this.fileRepository.findOne({where:{id},relations:['fileType']});
    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }
    return file;
  }

  async findUUID(uuid: string): Promise<File> {
    const file = await this.fileRepository.findOne({where:{minio_uuid:uuid},relations:['fileType']});
    if (!file) {
      throw new NotFoundException(`File with ID ${uuid} not found`);
    }
    return file;
  }

  async getFile(fileName: string, bucketName: string): Promise<Buffer> {
    return this.minioService.getAFile(fileName, bucketName);
  }

  async update(id: number, updateFileDto: UpdateFileDto): Promise<File> {
    await this.fileRepository.update(id, updateFileDto);
    const updatedFile = await this.fileRepository.findOne({where:{id}});
    if (!updatedFile) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }
    return updatedFile;
  }

  async updateViewCount(id: number, view_count:number){
    await this.fileRepository.update(id, {view_count:view_count});
  }

  async updateDownloadCount(id: number, download_count:number){
    await this.fileRepository.update(id, {download_count:download_count});
  }

  async remove(id: number): Promise<boolean> {
    // Dosyayı veritabanında bulma
    const file = await this.fileRepository.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }
  
    // MinIO'dan dosyayı silme
    try {
      await this.minioService.removeAFile(file.minio_name, 'main'); // 'main' bucket ismi olarak alındı
    } catch (error) {
      throw new BadRequestException('Failed to delete file from MinIO');
    }
  
    // Veritabanından dosya kaydını silme
    const result = await this.fileRepository.delete(file.id);
    if (result.affected === 0) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }else{
      return true;
    }
  }
}
