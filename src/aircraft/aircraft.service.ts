import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aircraft } from './entities/aircraft.entitiy';
import { CreateAircraftDto } from './dto/create-aircraft.dto';
import { UpdateAircraftDto } from './dto/update-aircraft.dto';

@Injectable()
export class AircraftService {
  constructor(
    @InjectRepository(Aircraft)
    private readonly aircraftRepository: Repository<Aircraft>
  ) {}

  async create(createAircraftDto: CreateAircraftDto): Promise<Aircraft> {
    const aircraft = this.aircraftRepository.create(createAircraftDto);
    return await this.aircraftRepository.save(aircraft);
  }

  async findAll(): Promise<Aircraft[]> {
    return await this.aircraftRepository.find({
      relations: ['aircraftType']
    });
  }

  async findOne(id: number): Promise<Aircraft | null> {
    return await this.aircraftRepository.findOne({
      where: { id:id },
      relations: ['aircraftType']
    });
  }

  async update(id: number, updateAircraftDto: UpdateAircraftDto): Promise<Aircraft | null> {
    await this.aircraftRepository.update(id, updateAircraftDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.aircraftRepository.delete(id);
  }
}
