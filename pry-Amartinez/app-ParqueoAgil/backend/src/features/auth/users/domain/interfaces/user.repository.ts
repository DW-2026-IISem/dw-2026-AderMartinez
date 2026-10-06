import { UserModel } from '../../infrastructure/persistence/models/user.model.js';

/**
 * Puerto del feature Users.
 *
 * Contrato de lo que el dominio necesita de la persistencia de usuarios. La
 * implementación concreta (Sequelize) vive en infrastructure.
 *
 * Detalle de seguridad: solo dos métodos exponen el hash (`...WithPassword`),
 * el resto de lecturas lo excluyen.
 */
export const USER_REPOSITORY = 'IUserRepository';

export interface IUserRepository {
  findAllActive(): Promise<UserModel[]>;
  findById(id: number): Promise<UserModel | null>;
  findByIdWithPassword(id: number): Promise<UserModel | null>;
  findByIdentifierWithPassword(identifier: string): Promise<UserModel | null>;
  findConflicts(username: string, email: string): Promise<UserModel[]>;
  create(data: {
    username: string;
    email: string;
    password: string;
    avatar?: string | null;
    status?: 'active' | 'inactive';
  }): Promise<UserModel>;
  update(
    user: UserModel,
    data: Partial<{
      username: string;
      email: string;
      password: string;
      avatar: string | null;
      status: 'active' | 'inactive';
    }>,
  ): Promise<UserModel>;
  delete(user: UserModel): Promise<void>;
}
