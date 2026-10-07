import { Inject, Injectable } from '@nestjs/common';
import { ApplicationException } from '../../../../../common/exceptions/application.exception.js';
import { BusinessRuleException } from '../../../../../common/exceptions/business-rule.exception.js';
import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';
import {
  CreateRoleUserDto,
  RoleUserResponseDto,
  toRoleUserResponse,
} from '../dto/index.js';
import { ROLE_USER_REPOSITORY } from '../../domain/interfaces/role-user.repository.js';
import type { IRoleUserRepository } from '../../domain/interfaces/role-user.repository.js';
import { USER_REPOSITORY } from '../../../users/domain/interfaces/user.repository.js';
import type { IUserRepository } from '../../../users/domain/interfaces/user.repository.js';
import { ROLE_REPOSITORY } from '../../../roles/domain/interfaces/role.repository.js';
import type { IRoleRepository } from '../../../roles/domain/interfaces/role.repository.js';
import { RoleUserModel } from '../../infrastructure/persistence/models/role-user.model.js';

/**
 * Capa Service del feature RoleUsers — asignaciones usuario ↔ rol.
 *
 * Reglas de negocio:
 *  - Solo se asigna un rol **activo** a un usuario **activo**.
 *  - Asignar es **idempotente**: si la pareja ya existía desactivada, se
 *    reactiva; si ya estaba activa, se informa 409 sin duplicar filas.
 *  - Retirar es un borrado lógico: preserva la auditoría y es reversible.
 *
 * El efecto es inmediato: la próxima petición del usuario vuelve a consultar
 * la cadena RBAC y ya ve (o deja de ver) el permiso.
 */
@Injectable()
export class RoleUsersService {
  constructor(
    @Inject(ROLE_USER_REPOSITORY)
    private readonly repository: IRoleUserRepository,
    @Inject(USER_REPOSITORY)
    private readonly usersRepository: IUserRepository,
    @Inject(ROLE_REPOSITORY)
    private readonly rolesRepository: IRoleRepository,
  ) {}

  // ================== READ ==================
  async getAll(): Promise<RoleUserResponseDto[]> {
    const assignments = await this.repository.findAllActive();
    return assignments.map((a) => toRoleUserResponse(a));
  }

  async getOne(id: number): Promise<RoleUserResponseDto> {
    return toRoleUserResponse(await this.findOrFail(id));
  }

  // ================== CREATE (asignar) ==================
  async assign(body: CreateRoleUserDto): Promise<RoleUserResponseDto> {
    if (!body.user_id || !body.role_id) {
      throw new ApplicationException(400, 'user_id y role_id son requeridos');
    }

    await this.assertUserActive(body.user_id);
    await this.assertRoleActive(body.role_id);

    const existing = await this.repository.findByUserAndRole(body.user_id, body.role_id);
    if (existing) {
      if (existing.status === 'active') {
        throw new BusinessRuleException('El rol ya está asignado a este usuario');
      }
      const reactivated = await this.repository.update(existing, { status: 'active' });
      return toRoleUserResponse(await this.reload(reactivated.id));
    }

    const created = await this.repository.create({
      user_id: body.user_id,
      role_id: body.role_id,
      status: 'active',
    });
    return toRoleUserResponse(await this.reload(created.id));
  }

  // ================== STATE (retirar / reactivar) ==================
  async deactivate(id: number): Promise<RoleUserResponseDto> {
    const assignment = await this.findOrFail(id);
    await this.repository.update(assignment, { status: 'inactive' });
    return toRoleUserResponse(await this.reload(assignment.id));
  }

  async reactivate(id: number): Promise<RoleUserResponseDto> {
    const assignment = await this.findOrFail(id, false);
    if (assignment.status === 'active') {
      throw new BusinessRuleException('La asignación ya está activa');
    }
    await this.repository.update(assignment, { status: 'active' });
    return toRoleUserResponse(await this.reload(assignment.id));
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number, onlyActive = true): Promise<RoleUserModel> {
    const assignment = await this.repository.findById(id);
    if (!assignment || (onlyActive && assignment.status !== 'active')) {
      throw new EntityNotFoundException('Asignación de rol no encontrada');
    }
    return assignment;
  }

  private async reload(id: number): Promise<RoleUserModel> {
    const assignment = await this.repository.findById(id);
    if (!assignment) {
      throw new EntityNotFoundException('Asignación de rol no encontrada');
    }
    return assignment;
  }

  private async assertUserActive(userId: number): Promise<void> {
    const user = await this.usersRepository.findById(userId);
    if (!user || user.status !== 'active') {
      throw new EntityNotFoundException('Usuario no encontrado o inactivo');
    }
  }

  private async assertRoleActive(roleId: number): Promise<void> {
    const role = await this.rolesRepository.findById(roleId);
    if (!role || role.status !== 'active') {
      throw new EntityNotFoundException('Rol no encontrado o inactivo');
    }
  }
}
