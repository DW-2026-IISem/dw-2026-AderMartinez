import { RoleModel } from '../../infrastructure/persistence/models/role.model.js';

/**
 * Respuesta HTTP de un rol. Sin campos internos: coincide con el modelo.
 */
export interface RoleResponseDto {
  id: number;
  name: string;
  description: string | null;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

/** Mapper modelo -> DTO de respuesta (objeto plano). */
export function toRoleResponse(role: RoleModel): RoleResponseDto {
  return role.toJSON() as RoleResponseDto;
}
