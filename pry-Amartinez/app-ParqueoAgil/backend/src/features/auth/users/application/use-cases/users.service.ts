import { Inject, Injectable } from '@nestjs/common';
import {
  BusinessRuleException,
} from '../../../../../common/exceptions/business-rule.exception.js';
import { ApplicationException } from '../../../../../common/exceptions/application.exception.js';
import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';
import { comparePassword } from '../../../../../shared/auth/password.js';
import {
  ChangePasswordDto,
  CreateUserDto,
  PatchUserDto,
  UpdateUserDto,
  UserResponseDto,
  toUserResponse,
} from '../dto/index.js';
import { USER_REPOSITORY } from '../../domain/interfaces/user.repository.js';
import type { IUserRepository } from '../../domain/interfaces/user.repository.js';
import { UserModel } from '../../infrastructure/persistence/models/user.model.js';

/**
 * Capa Service del feature Users.
 *
 * Reglas de negocio: unicidad de `username`/`email`, default de `status`,
 * política de borrado lógico, cambio de credencial y consulta de permisos
 * efectivos (que en ISS-12 delegará en ResourceRolesService).
 *
 * No conoce HTTP ni escribe Sequelize directamente.
 */
@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly repository: IUserRepository,
  ) {}

  // ================== READ ==================
  async getAll(): Promise<UserResponseDto[]> {
    const users = await this.repository.findAllActive();
    return users.map((user) => toUserResponse(user));
  }

  async getOne(id: number): Promise<UserResponseDto> {
    return toUserResponse(await this.findOrFail(id));
  }

  /**
   * Permisos efectivos del usuario.
   *
   * TODO ISS-12: delegar en ResourceRolesService.findEffectiveForUser(id).
   * Por ahora devuelve [] hasta que el feature resource-roles exista.
   */
  async getEffectivePermissions(id: number): Promise<Array<{ method: string; path: string }>> {
    await this.findOrFail(id);
    // TODO ISS-12: return this.resourceRolesService.findEffectiveForUser(id);
    return [];
  }

  // ================== CREATE ==================
  async create(body: CreateUserDto): Promise<UserResponseDto> {
    await this.assertUnique(body.username, body.email);

    const user = await this.repository.create({
      username: body.username,
      email: body.email,
      password: body.password,
      avatar: body.avatar ?? null,
      status: body.status ?? 'active',
    });
    return toUserResponse(user);
  }

  // ================== UPDATE ==================
  async updatePut(id: number, body: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.findOrFail(id);
    await this.assertUnique(body.username, body.email, id);

    await this.repository.update(user, {
      username: body.username,
      email: body.email,
      avatar: body.avatar ?? null,
    });
    return toUserResponse(user);
  }

  async updatePatch(id: number, body: PatchUserDto): Promise<UserResponseDto> {
    const user = await this.findOrFail(id);

    const username = body.username ?? user.username;
    const email = body.email ?? user.email;
    await this.assertUnique(username, email, id);

    await this.repository.update(user, body);
    return toUserResponse(user);
  }

  /**
   * Cambia la contraseña de un usuario.
   *
   * Verifica la credencial actual antes de aceptar la nueva. El hash lo vuelve
   * a calcular el hook `@BeforeUpdate` del modelo al detectar el campo cambiado.
   */
  async changePassword(id: number, body: ChangePasswordDto): Promise<void> {
    if (!body.current_password || !body.new_password) {
      throw new ApplicationException(
        400,
        'current_password y new_password son requeridos',
      );
    }

    const user = await this.repository.findByIdWithPassword(id);
    if (!user || user.status !== 'active') {
      throw new EntityNotFoundException('Usuario no encontrado');
    }

    const matches = await comparePassword(body.current_password, user.password);
    if (!matches) {
      throw new ApplicationException(400, 'Contraseña actual incorrecta');
    }

    await this.repository.update(user, { password: body.new_password });
  }

  // ================== DELETE ==================
  async deletePhysical(id: number): Promise<void> {
    const user = await this.findOrFail(id, false);
    await this.repository.delete(user);
  }

  async deleteLogical(id: number): Promise<UserResponseDto> {
    const user = await this.findOrFail(id);
    await this.repository.update(user, { status: 'inactive' });
    return toUserResponse(user);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number, onlyActive = true): Promise<UserModel> {
    const user = await this.repository.findById(id);
    if (!user || (onlyActive && user.status !== 'active')) {
      throw new EntityNotFoundException('Usuario no encontrado');
    }
    return user;
  }

  /**
   * Comprueba que `username` y `email` no estén tomados por **otro** usuario.
   *
   * `excludeId` permite excluir al propio usuario en las actualizaciones. Se
   * hace antes de escribir para responder 409 con un mensaje útil en lugar de
   * dejar que la restricción única de la BD reviente como un 500.
   */
  private async assertUnique(
    username: string,
    email: string,
    excludeId?: number,
  ): Promise<void> {
    const conflicts = await this.repository.findConflicts(username, email);
    const taken = conflicts.find((candidate) => candidate.id !== excludeId);

    if (!taken) return;
    if (taken.username === username.trim().toLowerCase()) {
      throw new BusinessRuleException('El username ya está en uso');
    }
    throw new BusinessRuleException('El email ya está en uso');
  }
}
