import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';
import { UserModel } from '../models/user.model.js';
import { IUserRepository } from '../../../domain/interfaces/user.repository.js';

/**
 * Implementación Sequelize del puerto `IUserRepository`.
 *
 * Detalle de seguridad: las lecturas **normales** excluyen `password` en la
 * proyección SQL. Solo `findByIdWithPassword` y `findByIdentifierWithPassword`
 * lo incluyen; el nombre lo dice. Así, un `findById` cualquiera jamás puede
 * devolver el hash por descuido.
 */
@Injectable()
export class UserRepository implements IUserRepository {
  private static readonly WITHOUT_PASSWORD = { exclude: ['password'] };

  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  private get repo() {
    return this.sequelize.getRepository(UserModel);
  }

  async findAllActive(): Promise<UserModel[]> {
    return this.repo.findAll({
      where: { status: 'active' },
      attributes: UserRepository.WITHOUT_PASSWORD,
    });
  }

  async findById(id: number): Promise<UserModel | null> {
    return this.repo.findByPk(id, {
      attributes: UserRepository.WITHOUT_PASSWORD,
    });
  }

  async findByIdWithPassword(id: number): Promise<UserModel | null> {
    return this.repo.findByPk(id);
  }

  async findByIdentifierWithPassword(identifier: string): Promise<UserModel | null> {
    const value = identifier.trim().toLowerCase();
    return this.repo.findOne({
      where: { [Op.or]: [{ username: value }, { email: value }] },
    });
  }

  async findConflicts(username: string, email: string): Promise<UserModel[]> {
    return this.repo.findAll({
      where: {
        [Op.or]: [
          { username: username.trim().toLowerCase() },
          { email: email.trim().toLowerCase() },
        ],
      },
      attributes: ['id', 'username', 'email'],
    });
  }

  async create(data: {
    username: string;
    email: string;
    password: string;
    avatar?: string | null;
    status?: 'active' | 'inactive';
  }): Promise<UserModel> {
    return this.repo.create({
      username: data.username,
      email: data.email,
      password: data.password,
      avatar: data.avatar ?? null,
      status: data.status ?? 'active',
    });
  }

  async update(
    user: UserModel,
    data: Partial<{
      username: string;
      email: string;
      password: string;
      avatar: string | null;
      status: 'active' | 'inactive';
    }>,
  ): Promise<UserModel> {
    return user.update(data);
  }

  async delete(user: UserModel): Promise<void> {
    await user.destroy();
  }
}
