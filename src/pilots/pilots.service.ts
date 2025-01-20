import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pilot } from './entities/pilots.entitiy';
import { CreatePilotDto, UpdatePilotDto } from './dto/create-pilot.dto';

@Injectable()
export class PilotsService {
    constructor(
        @InjectRepository(Pilot)
        private pilotsRepository: Repository<Pilot>
    ) {}

    async create(createPilotDto: CreatePilotDto): Promise<Pilot> {
        const pilot = this.pilotsRepository.create(createPilotDto);
        return await this.pilotsRepository.save(pilot);
    }

    async findAll(): Promise<Pilot[]> {
        return await this.pilotsRepository.find();
    }

    async findOne(id: number): Promise<Pilot | null> {
        return await this.pilotsRepository.findOne({ where: { id } });
    }

    async update(id: number, updatePilotDto: UpdatePilotDto): Promise<Pilot | null> {
        await this.pilotsRepository.update(id, updatePilotDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.pilotsRepository.delete(id);
    }
}
