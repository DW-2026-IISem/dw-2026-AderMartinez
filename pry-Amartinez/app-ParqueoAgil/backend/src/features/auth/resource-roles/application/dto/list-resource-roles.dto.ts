import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

/**
 * Filtros de `GET /api/concesiones-rol`.
 *
 * Permiten pedir «los permisos de este rol» (`?role_id=`) o «los roles que
 * conceden este recurso» (`?resource_id=`).
 */
export class ListResourceRolesDto {
  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  role_id?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  resource_id?: number;
}
