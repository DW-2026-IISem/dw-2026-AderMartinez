import { PartialType } from '@nestjs/swagger';
import { UpdateRoleDto } from './update-role.dto.js';

/** Datos de entrada de `PATCH /api/roles/:id` (actualización parcial). */
export class PatchRoleDto extends PartialType(UpdateRoleDto) {}
