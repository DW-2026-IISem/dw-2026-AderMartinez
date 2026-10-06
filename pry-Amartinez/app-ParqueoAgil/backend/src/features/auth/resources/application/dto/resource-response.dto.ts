import { ResourceModel } from '../../infrastructure/persistence/models/resource.model.js';

/** Respuesta HTTP de un recurso. */
export interface ResourceResponseDto {
  id: number;
  method: string;
  path: string;
  description: string | null;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

/** Mapper modelo -> DTO de respuesta (objeto plano). */
export function toResourceResponse(resource: ResourceModel): ResourceResponseDto {
  return resource.toJSON() as ResourceResponseDto;
}
