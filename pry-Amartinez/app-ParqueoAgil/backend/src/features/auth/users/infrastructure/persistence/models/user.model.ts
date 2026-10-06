import {
  BeforeBulkCreate,
  BeforeCreate,
  BeforeUpdate,
  BeforeValidate,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { hashPassword } from '../../../../../../shared/auth/password.js';

/**
 * Modelo `UserModel` (tabla `users`) — la identidad del sistema.
 *
 * Se diferencia de los modelos de business en un punto clave: **`password` nunca
 * se guarda en claro**. El hash se calcula en hooks, de modo que ningún service,
 * repositorio o seeder puede olvidarse de hacerlo.
 *
 * El algoritmo y el coste viven en `shared/auth/password.ts` (única fuente).
 */
@Table({
  tableName: 'users',
  timestamps: true,
})
export class UserModel extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(80),
    allowNull: false,
    unique: 'uq_users_username',
  })
  declare username: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
    unique: 'uq_users_email',
  })
  declare email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  declare avatar: string | null;

  @Column({
    type: DataType.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'inactive',
  })
  declare status: 'active' | 'inactive';

  @BeforeCreate
  static async hashPasswordBeforeCreate(user: UserModel): Promise<void> {
    if (user.password) {
      user.password = await hashPassword(user.password);
    }
  }

  @BeforeUpdate
  static async hashPasswordBeforeUpdate(user: UserModel): Promise<void> {
    if (user.changed('password') && user.password) {
      user.password = await hashPassword(user.password);
    }
  }

  @BeforeBulkCreate
  static async hashPasswordBeforeBulkCreate(users: UserModel[]): Promise<void> {
    for (const user of users) {
      if (user.password) {
        user.password = await hashPassword(user.password);
      }
    }
  }

  @BeforeValidate
  static normalizeBeforeValidate(user: UserModel): void {
    if (user.username) user.username = user.username.trim().toLowerCase();
    if (user.email) user.email = user.email.trim().toLowerCase();
  }
}
