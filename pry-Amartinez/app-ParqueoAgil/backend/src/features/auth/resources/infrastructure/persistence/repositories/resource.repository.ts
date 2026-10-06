import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';
import { normalizePath } from '../../../../../../shared/auth/resource-match.js';
import { ResourceModel } from '../models/resource.model.js';
import { IResourceRepository } from '../../../domain/interfaces/resource.repository.js';

/**
 * Implementación Sequelize del puerto `IResourceRepository`.
 */
@Injectable()
export class ResourceRepository implements IResourceRepository {
  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  private get repo() {
    return this.sequelize.getRepository(ResourceModel);
  }

  async findAllActive(): Promise<ResourceModel[]> {
    return this.repo.findAll({ where: { status: 'active' } });
  }

  async findById(id: number): Promise<ResourceModel | null> {
    return this.repo.findByPk(id);
  }

  async findByOperation(method: string, path: string): Promise<ResourceModel | null> {
    return this.repo.findOne({
      where: {
        method: method.trim().toUpperCase(),
        path: normalizePath(path.trim()),
      },
    });
  }

  async create(data: {
    method: string;
    path: string;
    description?: string | null;
    status?: 'active' | 'inactive';
  }): Promise<ResourceModel> {
    return this.repo.create({
      method: data.method.trim().toUpperCase(),
      path: normalizePath(data.path.trim()),
      description: data.description ?? null,
      status: data.status ?? 'active',
    });
  }

  async update(
    resource: ResourceModel,
    data: Partial<{
      method: string;
      path: string;
      description: string | null;
      status: 'active' | 'inactive';
    }>,
  ): Promise<ResourceModel> {
    return resource.update(data);
  }

  async delete(resource: ResourceModel): Promise<void> {
    await resource.destroy();
  }
}
