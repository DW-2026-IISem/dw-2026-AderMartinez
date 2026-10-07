import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

/**
 * Datos de entrada de `POST /api/asignaciones-rol` — **asignar un rol a un usuario**.
 *
 * Es el primer eslabón de la autorización. Si la asignación ya existía inactiva,
 * se **reactiva** en lugar de duplicarla (la restricción única `(user_id, role_id)`
 * lo garantiza).
 */
export class CreateRoleUserDto {
  @ApiProperty({ example: 2 })
  @IsInt({ message: 'user_id debe ser entero' })
  @Min(1, { message: 'user_id es requerido' })
  user_id!: number;

  @ApiProperty({ example: 1 })
  @IsInt({ message: 'role_id debe ser entero' })
  @Min(1, { message: 'role_id es requerido' })
  role_id!: number;
}
