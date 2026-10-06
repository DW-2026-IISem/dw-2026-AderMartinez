import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Datos de entrada de `POST /api/roles`.
 *
 * `name` se normaliza a MAYÚSCULAS en el modelo (`@BeforeValidate`).
 * Un rol **nace sin permisos**: el nombre no autoriza nada.
 */
export class CreateRoleDto {
  @ApiProperty({ example: 'AUDITOR' })
  @IsString()
  @IsNotEmpty({ message: 'name es requerido' })
  @MaxLength(80)
  name!: string;

  @ApiPropertyOptional({ example: 'Solo lectura' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({ example: 'active', enum: ['active', 'inactive'] })
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
