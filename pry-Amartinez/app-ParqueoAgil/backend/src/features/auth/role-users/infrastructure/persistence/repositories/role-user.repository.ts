import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';
import { RoleUserModel } from '../models/role-user.model.js';
import { RoleModel } from '../../../../roles/infrastructure/persistence/models/role.model.js';
import { UserModel } from '../../../../users/infrastructure/persistence/models/user.model.js';
import { IRoleUserRepository } from '../../../domain/interfaces/role-user.repository.js';

/**
 * Implementación Sequelize del puerto `IRoleUserRepository`.
 *
 * La proyección del usuario excluye `password` mediante `attributes` en el
 * `include` — nunca sale de la base de datos.
 */
@Injectable()
export class RoleUserRepository implements IRoleUserRepository {
  private static readonly SUMMARIES = [
    {
      model: UserModel,
      as: 'user',
      attributes: ['id', 'username', 'email'],
    },
    {
      model: RoleModel,
      as: 'role',
      attributes: ['id', 'name'],
    },
  ];

  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  private get repo() {
    return this.sequelize.getRepository(RoleUserModel);
  }

  async findAllActive(): Promise<RoleUserModel[]> {
    return this.repo.findAll({
      where: { status: 'active' },
      include: RoleUserRepository.SUMMARIES,
    });
  }

  async findById(id: number): Promise<RoleUserModel | null> {
    return this.repo.findByPk(id, { include: RoleUserRepository.SUMMARIES });
  }

  async findByUserAndRole(userId: number, roleId: number): Promise<RoleUserModel | null> {
    return this.repo.findOne({
      where: { user_id: userId, role_id: roleId },
    });
  }

  async create(data: {
    user_id: number;
    role_id: number;
    status?: 'active' | 'inactive';
  }): Promise<RoleUserModel> {
    return this.repo.create({
      user_id: data.user_id,
      role_id: data.role_id,
      status: data.status ?? 'active',
    });
  }

  async update(
    roleUser: RoleUserModel,
    data: Partial<{ status: 'active' | 'inactive' }>,
  ): Promise<RoleUserModel> {
    return roleUser.update(data);
  }
}
