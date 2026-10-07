import { ResourceRoleModel } from '../../infrastructure/persistence/models/resource-role.model.js';
import { EffectivePermissionDto } from '../../application/dto/index.js';

/**
 * Puerto del feature ResourceRoles.
 *
 * `findEffectiveForUser` es la **consulta de autorización efectiva**: recorre la
 * cadena `role_users → roles → resource_roles → resources` exigiendo status
 * activo en los cuatro eslabones.
 */
export const RESOURCE_ROLE_REPOSITORY = 'IResourceRoleRepository';

export interface IResourceRoleRepository {
  findAllActive(): Promise<ResourceRoleModel[]>;
  findAllActiveFiltered(filters: {
    role_id?: number;
    resource_id?: number;
  }): Promise<ResourceRoleModel[]>;
  findById(id: number): Promise<ResourceRoleModel | null>;
  findByRoleAndResource(
    roleId: number,
    resourceId: number,
  ): Promise<ResourceRoleModel | null>;
  findAllByRole(roleId: number): Promise<ResourceRoleModel[]>;
  findEffectiveForUser(userId: number): Promise<EffectivePermissionDto[]>;
  countActiveByRole(roleId: number): Promise<number>;
  countActive(): Promise<number>;
  create(data: {
    role_id: number;
    resource_id: number;
    status?: 'active' | 'inactive';
  }): Promise<ResourceRoleModel>;
  update(
    resourceRole: ResourceRoleModel,
    data: Partial<{ status: 'active' | 'inactive' }>,
  ): Promise<ResourceRoleModel>;
}
