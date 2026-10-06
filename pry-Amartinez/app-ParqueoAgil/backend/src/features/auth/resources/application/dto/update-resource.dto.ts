import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * Datos de entrada de `PUT /api/recursos/:id` (reemplazo completo).
 */
export class UpdateResourceDto {
  @ApiProperty({ example: 'GET', enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] })
  @IsIn(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
  method!: string;

  @ApiProperty({ example: '/api/tickets/:id' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  path!: string;

  @ApiPropertyOptional({ example: 'Consultar ticket' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
