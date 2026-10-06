import { UserModel } from '../../infrastructure/persistence/models/user.model.js';

/**
 * Respuesta HTTP de un usuario.
 *
 * Regla del DTO: `password` **nunca** sale de la API.
 */
export interface UserResponseDto {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

/** Mapper modelo -> DTO de respuesta (objeto plano; elimina `password`). */
export function toUserResponse(user: UserModel): UserResponseDto {
  const raw = user.toJSON() as Record<string, unknown>;
  const { password, ...safe } = raw;
  return safe as unknown as UserResponseDto;
}
