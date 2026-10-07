import { RoleUserModel } from '../../infrastructure/persistence/models/role-user.model.js';

/**
 * Puerto del feature RoleUsers.
 *
 * Detalle de seguridad: `findByUserAndRole` no filtra por status porque el
 * service necesita ver la asignación aunque esté inactiva para poder reactivarla.
 */
export const ROLE_USER_REPOSITORY = 'IRoleUserRepository';

export interface IRoleUserRepository {
  findAllActive(): Promise<RoleUserModel[]>;
  findById(id: number): Promise<RoleUserModel | null>;
  findByUserAndRole(userId: number, roleId: number): Promise<RoleUserModel | null>;
  create(data: {
    user_id: number;
    role_id: number;
    status?: 'active' | 'inactive';
  }): Promise<RoleUserModel>;
  update(
    roleUser: RoleUserModel,
    data: Partial<{ status: 'active' | 'inactive' }>,
  ): Promise<RoleUserModel>;
}
