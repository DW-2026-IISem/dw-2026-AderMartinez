import { ResourceModel } from '../../infrastructure/persistence/models/resource.model.js';

/**
 * Puerto del feature Resources.
 */
export const RESOURCE_REPOSITORY = 'IResourceRepository';

export interface IResourceRepository {
  findAllActive(): Promise<ResourceModel[]>;
  findById(id: number): Promise<ResourceModel | null>;
  findByOperation(method: string, path: string): Promise<ResourceModel | null>;
  create(data: {
    method: string;
    path: string;
    description?: string | null;
    status?: 'active' | 'inactive';
  }): Promise<ResourceModel>;
  update(
    resource: ResourceModel,
    data: Partial<{
      method: string;
      path: string;
      description: string | null;
      status: 'active' | 'inactive';
    }>,
  ): Promise<ResourceModel>;
  delete(resource: ResourceModel): Promise<void>;
}
