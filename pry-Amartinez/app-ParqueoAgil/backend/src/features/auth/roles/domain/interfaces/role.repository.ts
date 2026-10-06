import { RoleModel } from '../../infrastructure/persistence/models/role.model.js';

/**
 * Puerto del feature Roles.
 *
 * Contrato de lo que el dominio necesita de la persistencia de roles.
 */
export const ROLE_REPOSITORY = 'IRoleRepository';

export interface IRoleRepository {
  findAllActive(): Promise<RoleModel[]>;
  findById(id: number): Promise<RoleModel | null>;
  findByName(name: string): Promise<RoleModel | null>;
  create(data: {
    name: string;
    description?: string | null;
    status?: 'active' | 'inactive';
  }): Promise<RoleModel>;
  update(
    role: RoleModel,
    data: Partial<{
      name: string;
      description: string | null;
      status: 'active' | 'inactive';
    }>,
  ): Promise<RoleModel>;
  delete(role: RoleModel): Promise<void>;
}
