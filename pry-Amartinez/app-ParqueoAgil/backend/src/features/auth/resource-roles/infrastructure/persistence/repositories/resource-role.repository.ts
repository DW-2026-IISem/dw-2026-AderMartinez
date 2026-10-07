import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';
import { ResourceRoleModel } from '../models/resource-role.model.js';
import { RoleModel } from '../../../../roles/infrastructure/persistence/models/role.model.js';
import { ResourceModel } from '../../../../resources/infrastructure/persistence/models/resource.model.js';
import { RoleUserModel } from '../../../../role-users/infrastructure/persistence/models/role-user.model.js';
import { IResourceRoleRepository } from '../../../domain/interfaces/resource-role.repository.js';
import { EffectivePermissionDto } from '../../../application/dto/index.js';

/**
 * Implementación Sequelize del puerto `IResourceRoleRepository`.
 *
 * Aquí vive la **consulta de autorización efectiva**: la única que recorre la
 * cadena completa de seguridad. Es el corazón del RBAC.
 */
@Injectable()
export class ResourceRoleRepository implements IResourceRoleRepository {
  private static readonly SUMMARIES = [
    {
      model: RoleModel,
      as: 'role',
      attributes: ['id', 'name'],
    },
    {
      model: ResourceModel,
      as: 'resource',
      attributes: ['id', 'method', 'path', 'description'],
    },
  ];

  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  private get repo() {
    return this.sequelize.getRepository(ResourceRoleModel);
  }

  async findAllActive(): Promise<ResourceRoleModel[]> {
    return this.repo.findAll({
      where: { status: 'active' },
      include: ResourceRoleRepository.SUMMARIES,
    });
  }

  async findAllActiveFiltered(filters: {
    role_id?: number;
    resource_id?: number;
  }): Promise<ResourceRoleModel[]> {
    const where: Record<string, unknown> = { status: 'active' };
    if (filters.role_id) where.role_id = filters.role_id;
    if (filters.resource_id) where.resource_id = filters.resource_id;

    return this.repo.findAll({
      where,
      include: ResourceRoleRepository.SUMMARIES,
      order: [['id', 'ASC']],
    });
  }

  async findById(id: number): Promise<ResourceRoleModel | null> {
    return this.repo.findByPk(id, { include: ResourceRoleRepository.SUMMARIES });
  }

  async findByRoleAndResource(
    roleId: number,
    resourceId: number,
  ): Promise<ResourceRoleModel | null> {
    return this.repo.findOne({
      where: { role_id: roleId, resource_id: resourceId },
    });
  }

  async findAllByRole(roleId: number): Promise<ResourceRoleModel[]> {
    return this.repo.findAll({ where: { role_id: roleId } });
  }

  /**
   * **CONSULTA DE AUTORIZACIÓN EFECTIVA**.
   *
   * Devuelve los recursos que un usuario puede ejecutar, recorriendo la cadena
   * y exigiendo `status = 'active'` en **los cuatro eslabones**:
   *
   *   resource_roles (rr)  → rr.status = active
   *     JOIN roles (ro)     → ro.status = active
   *     JOIN role_users(ru) → ru.status = active AND ru.user_id = :userId
   *     JOIN resources (r)  → r.status  = active
   *
   * Si cualquier eslabón está inactivo o ausente, la fila no aparece: el
   * resultado vacío se traduce en **deny by default** en el middleware.
   */
  async findEffectiveForUser(userId: number): Promise<EffectivePermissionDto[]> {
    const rows = await this.repo.findAll({
      where: { status: 'active' },
      attributes: ['id'],
      include: [
        {
          model: RoleModel,
          as: 'role',
          required: true,
          attributes: ['id', 'name'],
          where: { status: 'active' },
          include: [
            {
              model: RoleUserModel,
              as: 'role_users',
              required: true,
              attributes: [],
              where: { status: 'active', user_id: userId },
            },
          ],
        },
        {
          model: ResourceModel,
          as: 'resource',
          required: true,
          attributes: ['id', 'method', 'path', 'description'],
          where: { status: 'active' },
        },
      ],
      order: [['id', 'ASC']],
    });

    return rows.map((row) => {
      const plain = row.toJSON() as unknown as {
        role: { id: number; name: string };
        resource: {
          id: number;
          method: string;
          path: string;
          description: string | null;
        };
      };
      return {
        resource_id: plain.resource.id,
        method: plain.resource.method,
        path: plain.resource.path,
        description: plain.resource.description,
        role_id: plain.role.id,
        role_name: plain.role.name,
      };
    });
  }

  async countActiveByRole(roleId: number): Promise<number> {
    return this.repo.count({ where: { role_id: roleId, status: 'active' } });
  }

  async countActive(): Promise<number> {
    return this.repo.count({ where: { status: 'active' } });
  }

  async create(data: {
    role_id: number;
    resource_id: number;
    status?: 'active' | 'inactive';
  }): Promise<ResourceRoleModel> {
    return this.repo.create({
      role_id: data.role_id,
      resource_id: data.resource_id,
      status: data.status ?? 'active',
    });
  }

  async update(
    resourceRole: ResourceRoleModel,
    data: Partial<{ status: 'active' | 'inactive' }>,
  ): Promise<ResourceRoleModel> {
    return resourceRole.update(data);
  }
}
