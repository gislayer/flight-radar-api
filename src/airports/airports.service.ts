import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Airport } from './entities/airports.entitiy';
import { CreateAirportDto } from './dto/create-airports.dto';
import { UpdateAirportDto } from './dto/update-airports.dto';

@Injectable()
export class AirportsService {
  constructor(
    @InjectRepository(Airport)
    private readonly airportRepository: Repository<Airport>,
  ) {}

  async create(data: CreateAirportDto): Promise<Airport> {
    const airport = this.airportRepository.create({name:data.name, geometry:data.geometry});
    return await this.airportRepository.save(airport);
  }

  async findAll(): Promise<Airport[]> {
    return await this.airportRepository.find();
  }

  async findOne(id: number): Promise<Airport | null> {
    return await this.airportRepository.findOneBy({ id });
  }

  async update(id: number, updateAirportDto: UpdateAirportDto): Promise<Airport | null> {
    await this.airportRepository.update(id, updateAirportDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.airportRepository.delete(id);
  }
}
