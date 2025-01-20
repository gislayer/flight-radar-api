// src/files/files.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { File as FileEntity } from './entities/file.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';

@ApiTags('File Management')
@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new file' })
    @ApiResponse({ status: 201, description: 'The file has been successfully created.', type: FileEntity })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    @ApiBody({
      description: 'File to upload',
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
          name: {
            type: 'string',
          }
        },
      },
    })
    create(@UploadedFile() file: Express.Multer.File, @Body() createFileDto: CreateFileDto, @Req() req: Request): Promise<FileEntity> {
      return this.filesService.create(file, createFileDto);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all files' })
    @ApiResponse({ status: 200, description: 'Return all files', type: [FileEntity] })
    findAll(@Req() req: Request): Promise<FileEntity[]> {
      return this.filesService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a file by id' })
    @ApiResponse({ status: 200, description: 'Return the file with the given id', type: FileEntity })
    @ApiResponse({ status: 404, description: 'File not found' })
    @ApiParam({ name: 'id', required: true, description: 'ID of the file' })
    findOne(@Param('id') id: number, @Req() req: Request): Promise<FileEntity> {
      return this.filesService.findOne(id);
    }

    @Get('/view/:uuid')
    async getFile(@Param('uuid') uuid: string, @Res() res: Response, @Req() req: Request): Promise<void> {
      const bucketName = 'main';
      var ind = uuid.indexOf('.');
      if(ind!==-1){
        var splits = uuid.split('.')
        uuid = splits[0];
      }
      const fileDb = await this.filesService.findUUID(uuid);
      fileDb.view_count++;
      await this.filesService.updateViewCount(fileDb.id,fileDb.view_count);
      const file = await this.filesService.getFile(fileDb.minio_name, bucketName);
      res.setHeader('Content-Type', fileDb.fileType.mimetype);
      res.setHeader('Content-Disposition', `inline; filename="${fileDb.file_name}"`);
      res.send(file);
    }

    @Get('/download/:uuid')
    async getFileDownload(@Param('uuid') uuid: string, @Res() res: Response, @Req() req: Request): Promise<void> {
      const bucketName = 'main';
      const fileDb = await this.filesService.findUUID(uuid);
      fileDb.download_count++;
      await this.filesService.updateDownloadCount(fileDb.id,fileDb.download_count);
      const file = await this.filesService.getFile(fileDb.minio_name, bucketName);
      res.setHeader('Content-Type', fileDb.fileType.mimetype);
      res.setHeader('Content-Disposition', `attachment; filename="${fileDb.file_name}"`);
      res.send(file);
    }
  
    @Patch(':id')
    @ApiOperation({ summary: 'Update a file by id' })
    @ApiResponse({ status: 200, description: 'The file has been successfully updated.', type: FileEntity })
    @ApiResponse({ status: 404, description: 'File not found' })
    update(@Param('id') id: number, @Body() updateFileDto: UpdateFileDto, @Req() req: Request): Promise<FileEntity> {
      return this.filesService.update(id, updateFileDto);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a file by id' })
    @ApiResponse({ status: 200, description: 'The file has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'File not found' })
    remove(@Param('id') id: number, @Req() req: Request): Promise<boolean> {
      return this.filesService.remove(id);
    }
  }