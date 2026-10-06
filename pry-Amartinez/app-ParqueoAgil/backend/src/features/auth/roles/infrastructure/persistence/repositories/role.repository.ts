import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';
import { RoleModel } from '../models/role.model.js';
import { IRoleRepository } from '../../../domain/interfaces/role.repository.js';

/**
 * Implementación Sequelize del puerto `IRoleRepository`.
 */
@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  private get repo() {
    return this.sequelize.getRepository(RoleModel);
  }

  async findAllActive(): Promise<RoleModel[]> {
    return this.repo.findAll({ where: { status: 'active' } });
  }

  async findById(id: number): Promise<RoleModel | null> {
    return this.repo.findByPk(id);
  }

  async findByName(name: string): Promise<RoleModel | null> {
    return this.repo.findOne({ where: { name: name.trim().toUpperCase() } });
  }

  async create(data: {
    name: string;
    description?: string | null;
    status?: 'active' | 'inactive';
  }): Promise<RoleModel> {
    return this.repo.create({
      name: data.name,
      description: data.description ?? null,
      status: data.status ?? 'active',
    });
  }

  async update(
    role: RoleModel,
    data: Partial<{
      name: string;
      description: string | null;
      status: 'active' | 'inactive';
    }>,
  ): Promise<RoleModel> {
    return role.update(data);
  }

  async delete(role: RoleModel): Promise<void> {
    await role.destroy();
  }
}
