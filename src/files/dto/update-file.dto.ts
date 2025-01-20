import { ApiProperty } from '@nestjs/swagger';

export class UpdateFileDto {
  @ApiProperty({ description: 'Name of the file' })
  name: string;

  @ApiProperty({ description: 'Status of the file' })
  status: boolean;
}
