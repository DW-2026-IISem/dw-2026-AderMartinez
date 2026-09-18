import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';
import { VehicleType } from '../../../domain/entities/vehicle-type.entity.js';
import type { VehicleTypeStatus } from '../../../domain/entities/vehicle-type.entity.js';
import { IVehicleTypeRepository } from '../../../domain/interfaces/vehicle-type.repository.js';
import { VehicleTypeModel } from '../models/vehicle-type.model.js';

@Injectable()
export class VehicleTypeRepository implements IVehicleTypeRepository {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  private get repo() {
    return this.sequelize.getRepository(VehicleTypeModel);
  }

  async create(vt: VehicleType): Promise<VehicleType> {
    const created = await this.repo.create({
      name: vt.name,
      hourlyRate: vt.hourlyRate,
      description: vt.description,
      status: vt.status,
    });
    return this.toDomain(created);
  }

  async findAll(page: number, limit: number) {
    const { rows, count } = await this.repo.findAndCountAll({
      offset: (page - 1) * limit,
      limit,
      order: [['id', 'ASC']],
    });
    return { items: rows.map((r) => this.toDomain(r)), total: count };
  }

  async findById(id: number): Promise<VehicleType | null> {
    const found = await this.repo.findByPk(id);
    return found ? this.toDomain(found) : null;
  }

  async findByName(name: string): Promise<VehicleType | null> {
    const found = await this.repo.findOne({ where: { name } });
    return found ? this.toDomain(found) : null;
  }

  async count(): Promise<number> {
    return this.repo.count();
  }

  private toDomain(m: VehicleTypeModel): VehicleType {
    return new VehicleType({
      id: m.id,
      name: m.name,
      hourlyRate: Number(m.hourlyRate),
      description: m.description ?? null,
      status: (m.status as VehicleTypeStatus) ?? 'active',
    });
  }
}
