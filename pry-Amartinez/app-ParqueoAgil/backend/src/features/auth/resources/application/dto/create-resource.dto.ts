import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Datos de entrada de `POST /api/recursos`.
 *
 * `path` se guarda con el patrón (`/api/tickets/:id`), no con un valor concreto.
 */
export class CreateResourceDto {
  @ApiProperty({ example: 'GET', enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] })
  @IsIn(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], {
    message: 'method debe ser GET, POST, PUT, PATCH o DELETE',
  })
  method!: string;

  @ApiProperty({ example: '/api/tickets/:id' })
  @IsString()
  @IsNotEmpty({ message: 'path es requerido' })
  @MaxLength(255)
  path!: string;

  @ApiPropertyOptional({ example: 'Consultar ticket' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({ example: 'active', enum: ['active', 'inactive'] })
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
