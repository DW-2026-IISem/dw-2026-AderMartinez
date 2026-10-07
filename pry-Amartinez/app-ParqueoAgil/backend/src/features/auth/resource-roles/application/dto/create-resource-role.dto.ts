import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

/**
 * Datos de entrada de `POST /api/concesiones-rol` — **conceder un recurso a un rol**.
 *
 * Esta operación **crea un permiso**: el permiso no es una entidad con nombre,
 * es la tupla `(role_id, resource_id)` materializada en `resource_roles`. Si la
 * concesión ya existía inactiva, se reactiva en lugar de duplicarla.
 */
export class CreateResourceRoleDto {
  @ApiProperty({ example: 2 })
  @IsInt({ message: 'role_id debe ser entero' })
  @Min(1, { message: 'role_id es requerido' })
  role_id!: number;

  @ApiProperty({ example: 1 })
  @IsInt({ message: 'resource_id debe ser entero' })
  @Min(1, { message: 'resource_id es requerido' })
  resource_id!: number;
}
