import { Inject, Injectable } from '@nestjs/common';
import { BusinessRuleException } from '../../../../../common/exceptions/business-rule.exception.js';
import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';
import {
  CreateRoleDto,
  PatchRoleDto,
  RoleResponseDto,
  UpdateRoleDto,
  toRoleResponse,
} from '../dto/index.js';
import { ROLE_REPOSITORY } from '../../domain/interfaces/role.repository.js';
import type { IRoleRepository } from '../../domain/interfaces/role.repository.js';
import { RoleModel } from '../../infrastructure/persistence/models/role.model.js';

/**
 * Capa Service del feature Roles.
 *
 * Regla de negocio: el nombre del rol es único. La autorización **nunca** se
 * decide por el nombre, sino por las concesiones (`resource_roles`) asociadas.
 */
@Injectable()
export class RolesService {
  constructor(
    @Inject(ROLE_REPOSITORY)
    private readonly repository: IRoleRepository,
  ) {}

  // ================== READ ==================
  async getAll(): Promise<RoleResponseDto[]> {
    const roles = await this.repository.findAllActive();
    return roles.map((role) => toRoleResponse(role));
  }

  async getOne(id: number): Promise<RoleResponseDto> {
    return toRoleResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  async create(body: CreateRoleDto): Promise<RoleResponseDto> {
    await this.assertNameAvailable(body.name);

    const role = await this.repository.create({
      name: body.name,
      description: body.description ?? null,
      status: body.status ?? 'active',
    });
    return toRoleResponse(role);
  }

  // ================== UPDATE ==================
  async updatePut(id: number, body: UpdateRoleDto): Promise<RoleResponseDto> {
    const role = await this.findOrFail(id);
    await this.assertNameAvailable(body.name, id);

    await this.repository.update(role, {
      name: body.name,
      description: body.description ?? null,
    });
    return toRoleResponse(role);
  }

  async updatePatch(id: number, body: PatchRoleDto): Promise<RoleResponseDto> {
    const role = await this.findOrFail(id);

    if (body.name) {
      await this.assertNameAvailable(body.name, id);
    }

    await this.repository.update(role, body);
    return toRoleResponse(role);
  }

  // ================== DELETE ==================
  async deletePhysical(id: number): Promise<void> {
    const role = await this.findOrFail(id, false);
    await this.repository.delete(role);
  }

  async deleteLogical(id: number): Promise<RoleResponseDto> {
    const role = await this.findOrFail(id);
    await this.repository.update(role, { status: 'inactive' });
    return toRoleResponse(role);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number, onlyActive = true): Promise<RoleModel> {
    const role = await this.repository.findById(id);
    if (!role || (onlyActive && role.status !== 'active')) {
      throw new EntityNotFoundException('Rol no encontrado');
    }
    return role;
  }

  private async assertNameAvailable(name: string, excludeId?: number): Promise<void> {
    const existing = await this.repository.findByName(name);
    if (existing && existing.id !== excludeId) {
      throw new BusinessRuleException('El nombre del rol ya está en uso');
    }
  }
}
