import { ApiProperty } from '@nestjs/swagger';

export class FileTypeDto {
  @ApiProperty({ description: 'Size of the file' })
  id: number;
}

export class CreateFileDto {
  @ApiProperty({ description: 'Name of the file' })
  name: string;

  @ApiProperty({ description: 'File name' })
  file_name: string;

  @ApiProperty({ description: 'ID of the file type' })
  fileType: FileTypeDto;

  @ApiProperty({ description: 'Size of the file' })
  size: number;

  @ApiProperty({ description: 'UUID of the file in MinIO' })
  minio_uuid: string;

  @ApiProperty({ description: 'UUID of the file in MinIO' })
  minio_name: string;

  @ApiProperty({ description: 'Visit count of the file' })
  view_count: number;

  @ApiProperty({ description: 'Download count of the file' })
  download_count: number;

  @ApiProperty({ description: 'Status of the file' })
  status: boolean;
}
