import { PartialType } from '@nestjs/swagger';
import { UpdateResourceDto } from './update-resource.dto.js';

/** Datos de entrada de `PATCH /api/recursos/:id` (actualización parcial). */
export class PatchResourceDto extends PartialType(UpdateResourceDto) {}
