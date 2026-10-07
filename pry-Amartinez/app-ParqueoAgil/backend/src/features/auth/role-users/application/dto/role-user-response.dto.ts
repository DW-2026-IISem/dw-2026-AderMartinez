import { RoleUserModel } from '../../infrastructure/persistence/models/role-user.model.js';

/**
 * Respuesta HTTP de una asignación usuario-rol.
 *
 * Incluye, además de las claves foráneas, un resumen del usuario y del rol
 * para que el consumidor no tenga que hacer dos peticiones extra.
 */
export interface RoleUserResponseDto {
  id: number;
  user_id: number;
  role_id: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  user?: { id: number; username: string; email: string } | null;
  role?: { id: number; name: string } | null;
}

/** Mapper modelo -> DTO de respuesta (objeto plano). */
export function toRoleUserResponse(roleUser: RoleUserModel): RoleUserResponseDto {
  return roleUser.toJSON() as RoleUserResponseDto;
}
