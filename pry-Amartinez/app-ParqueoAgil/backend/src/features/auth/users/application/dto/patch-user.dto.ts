import { PartialType } from '@nestjs/swagger';
import { UpdateUserDto } from './update-user.dto.js';

/**
 * Datos de entrada de `PATCH /api/usuarios/:id` (actualización parcial).
 *
 * `PartialType` de Swagger hace todos los campos opcionales y mantiene los
 * decoradores de validación del DTO base.
 */
export class PatchUserDto extends PartialType(UpdateUserDto) {}
