import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ApplicationException } from '../../../../../common/exceptions/application.exception.js';
import { BusinessRuleException } from '../../../../../common/exceptions/business-rule.exception.js';
import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';
import { SEQUELIZE } from '../../../../../infrastructure/database/sequelize/sequelize.module.js';
import {
  CreateResourceRoleDto,
  EffectivePermissionDto,
  ListResourceRolesDto,
  ResourceRoleResponseDto,
  toResourceRoleResponse,
} from '../dto/index.js';
import { RESOURCE_ROLE_REPOSITORY } from '../../domain/interfaces/resource-role.repository.js';
import type { IResourceRoleRepository } from '../../domain/interfaces/resource-role.repository.js';
import { ROLE_REPOSITORY } from '../../../roles/domain/interfaces/role.repository.js';
import type { IRoleRepository } from '../../../roles/domain/interfaces/role.repository.js';
import { RESOURCE_REPOSITORY } from '../../../resources/domain/interfaces/resource.repository.js';
import type { IResourceRepository } from '../../../resources/domain/interfaces/resource.repository.js';
import { ResourceRoleModel } from '../../infrastructure/persistence/models/resource-role.model.js';

/** Resumen de una reconciliación de concesiones de un rol. */
export interface ReconcileResult {
  role_id: number;
  activated: number;
  deactivated: number;
  total_active: number;
}

/**
 * Capa Service del feature ResourceRoles — la gestión de permisos.
 *
 * Aquí es donde el modelo "Role + Resource = permiso" se vuelve operativo:
 *  - `grant`               → concede un recurso a un rol (crea o reactiva).
 *  - `deactivate`          → retira el permiso (borrado lógico, reversible).
 *  - `findEffectiveForUser`→ permisos efectivos de un usuario.
 *  - `reconcileRole`       → deja el catálogo de un rol exactamente en un
 *                            conjunto dado de recursos (idempotente).
 */
@Injectable()
export class ResourceRolesService {
  constructor(
    @Inject(RESOURCE_ROLE_REPOSITORY)
    private readonly repository: IResourceRoleRepository,
    @Inject(ROLE_REPOSITORY)
    private readonly rolesRepository: IRoleRepository,
    @Inject(RESOURCE_REPOSITORY)
    private readonly resourcesRepository: IResourceRepository,
    @Inject(SEQUELIZE)
    private readonly sequelize: Sequelize,
  ) {}

  // ================== READ ==================
  async getAll(filters: ListResourceRolesDto = {}): Promise<ResourceRoleResponseDto[]> {
    const grants = await this.repository.findAllActiveFiltered({
      role_id: filters.role_id,
      resource_id: filters.resource_id,
    });
    return grants.map((g) => toResourceRoleResponse(g));
  }

  async getOne(id: number): Promise<ResourceRoleResponseDto> {
    return toResourceRoleResponse(await this.findOrFail(id));
  }

  async findEffectiveForUser(userId: number): Promise<EffectivePermissionDto[]> {
    return this.repository.findEffectiveForUser(userId);
  }

  // ================== CREATE (conceder) ==================
  async grant(body: CreateResourceRoleDto): Promise<ResourceRoleResponseDto> {
    if (!body.role_id || !body.resource_id) {
      throw new ApplicationException(400, 'role_id y resource_id son requeridos');
    }

    const role = await this.rolesRepository.findById(body.role_id);
    if (!role || role.status !== 'active') {
      throw new EntityNotFoundException('Rol no encontrado o inactivo');
    }
    const resource = await this.resourcesRepository.findById(body.resource_id);
    if (!resource || resource.status !== 'active') {
      throw new EntityNotFoundException('Recurso no encontrado o inactivo');
    }

    const existing = await this.repository.findByRoleAndResource(
      body.role_id,
      body.resource_id,
    );
    if (existing) {
      if (existing.status === 'active') {
        throw new BusinessRuleException('El rol ya tiene concedido este recurso');
      }
      const reactivated = await this.repository.update(existing, { status: 'active' });
      return toResourceRoleResponse(await this.reload(reactivated.id));
    }

    const created = await this.repository.create({
      role_id: body.role_id,
      resource_id: body.resource_id,
      status: 'active',
    });
    return toResourceRoleResponse(await this.reload(created.id));
  }

  // ================== STATE (retirar / reactivar) ==================
  async deactivate(id: number): Promise<ResourceRoleResponseDto> {
    const grant = await this.findOrFail(id);
    await this.repository.update(grant, { status: 'inactive' });
    return toResourceRoleResponse(await this.reload(grant.id));
  }

  async reactivate(id: number): Promise<ResourceRoleResponseDto> {
    const grant = await this.findOrFail(id, false);
    if (grant.status === 'active') {
      throw new BusinessRuleException('La concesión ya está activa');
    }
    await this.repository.update(grant, { status: 'active' });
    return toResourceRoleResponse(await this.reload(grant.id));
  }

  // ================== RECONCILIACIÓN ==================
  /**
   * Deja las concesiones de un rol **exactamente** en `resourceIds`.
   *
   * - Recursos de la lista sin concesión → se conceden.
   * - Recursos de la lista con concesión inactiva → se reactivan.
   * - Recursos concedidos que no están en la lista → se retiran (inactive).
   *
   * Todo dentro de una transacción: o el rol queda con ese catálogo exacto, o
   * no se toca nada. Lo usa el seeder para `SELLER` (11 recursos) y `ADMIN` (58).
   */
  async reconcileRole(roleId: number, resourceIds: number[]): Promise<ReconcileResult> {
    const role = await this.rolesRepository.findById(roleId);
    if (!role) {
      throw new EntityNotFoundException('Rol no encontrado');
    }

    const wanted = new Set(resourceIds);

    return this.sequelize.transaction(async (t) => {
      const existing = await this.repository.findAllByRole(roleId);
      const byResource = new Map(existing.map((row) => [row.resource_id, row]));

      let activated = 0;
      let deactivated = 0;

      for (const resourceId of wanted) {
        const row = byResource.get(resourceId);
        if (!row) {
          await this.repository.create({
            role_id: roleId,
            resource_id: resourceId,
            status: 'active',
          });
          activated++;
          continue;
        }
        if (row.status !== 'active') {
          await this.repository.update(row, { status: 'active' });
          activated++;
        }
      }

      for (const row of existing) {
        if (wanted.has(row.resource_id)) continue;
        if (row.status === 'active') {
          await this.repository.update(row, { status: 'inactive' });
          deactivated++;
        }
      }

      return {
        role_id: roleId,
        activated,
        deactivated,
        total_active: wanted.size,
      };
    });
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number, onlyActive = true): Promise<ResourceRoleModel> {
    const grant = await this.repository.findById(id);
    if (!grant || (onlyActive && grant.status !== 'active')) {
      throw new EntityNotFoundException('Concesión no encontrada');
    }
    return grant;
  }

  private async reload(id: number): Promise<ResourceRoleModel> {
    const grant = await this.repository.findById(id);
    if (!grant) {
      throw new EntityNotFoundException('Concesión no encontrada');
    }
    return grant;
  }
}
