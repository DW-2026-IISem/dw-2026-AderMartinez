import { Inject, Injectable } from '@nestjs/common';
import { ApplicationException } from '../../../../../common/exceptions/application.exception.js';
import { BusinessRuleException } from '../../../../../common/exceptions/business-rule.exception.js';
import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';
import {
  CreateResourceDto,
  PatchResourceDto,
  ResourceResponseDto,
  UpdateResourceDto,
  toResourceResponse,
} from '../dto/index.js';
import { RESOURCE_REPOSITORY } from '../../domain/interfaces/resource.repository.js';
import type { IResourceRepository } from '../../domain/interfaces/resource.repository.js';
import { ResourceModel } from '../../infrastructure/persistence/models/resource.model.js';

/**
 * Capa Service del feature Resources.
 *
 * Regla de negocio: la tupla `(method, path)` es única. Se comprueba antes de
 * escribir para responder 409 con un mensaje útil en lugar de dejar reventar la
 * restricción única de la base de datos como 500.
 */
@Injectable()
export class ResourcesService {
  constructor(
    @Inject(RESOURCE_REPOSITORY)
    private readonly repository: IResourceRepository,
  ) {}

  // ================== READ ==================
  async getAll(): Promise<ResourceResponseDto[]> {
    const resources = await this.repository.findAllActive();
    return resources.map((resource) => toResourceResponse(resource));
  }

  async getOne(id: number): Promise<ResourceResponseDto> {
    return toResourceResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  async create(body: CreateResourceDto): Promise<ResourceResponseDto> {
    if (!body.method || !body.path) {
      throw new ApplicationException(400, 'method y path son requeridos');
    }
    await this.assertOperationAvailable(body.method, body.path);

    const resource = await this.repository.create({
      method: body.method,
      path: body.path,
      description: body.description ?? null,
      status: body.status ?? 'active',
    });
    return toResourceResponse(resource);
  }

  // ================== UPDATE ==================
  async updatePut(id: number, body: UpdateResourceDto): Promise<ResourceResponseDto> {
    const resource = await this.findOrFail(id);
    await this.assertOperationAvailable(body.method, body.path, id);

    await this.repository.update(resource, {
      method: body.method,
      path: body.path,
      description: body.description ?? null,
    });
    return toResourceResponse(resource);
  }

  async updatePatch(id: number, body: PatchResourceDto): Promise<ResourceResponseDto> {
    const resource = await this.findOrFail(id);

    const method = body.method ?? resource.method;
    const path = body.path ?? resource.path;
    await this.assertOperationAvailable(method, path, id);

    await this.repository.update(resource, body);
    return toResourceResponse(resource);
  }

  // ================== DELETE ==================
  async deletePhysical(id: number): Promise<void> {
    const resource = await this.findOrFail(id, false);
    await this.repository.delete(resource);
  }

  async deleteLogical(id: number): Promise<ResourceResponseDto> {
    const resource = await this.findOrFail(id);
    await this.repository.update(resource, { status: 'inactive' });
    return toResourceResponse(resource);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number, onlyActive = true): Promise<ResourceModel> {
    const resource = await this.repository.findById(id);
    if (!resource || (onlyActive && resource.status !== 'active')) {
      throw new EntityNotFoundException('Recurso no encontrado');
    }
    return resource;
  }

  private async assertOperationAvailable(
    method: string,
    path: string,
    excludeId?: number,
  ): Promise<void> {
    const existing = await this.repository.findByOperation(method, path);
    if (existing && existing.id !== excludeId) {
      throw new BusinessRuleException(
        `El recurso ${method.toUpperCase()} ${path} ya existe`,
      );
    }
  }
}
