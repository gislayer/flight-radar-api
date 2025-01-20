import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreatePilotDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsObject()
    settings?: Record<string, any>;
}

export class UpdatePilotDto extends CreatePilotDto {}
