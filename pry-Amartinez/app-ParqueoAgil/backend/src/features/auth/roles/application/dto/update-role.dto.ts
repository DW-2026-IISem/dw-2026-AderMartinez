import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Datos de entrada de `PUT /api/roles/:id` (reemplazo completo).
 * `status` no está aquí: el estado solo cambia con el borrado lógico.
 */
export class UpdateRoleDto {
  @ApiProperty({ example: 'AUDITOR' })
  @IsString()
  @IsNotEmpty({ message: 'name es requerido' })
  @MaxLength(80)
  name!: string;

  @ApiPropertyOptional({ example: 'Solo lectura de catálogo y ventas' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
