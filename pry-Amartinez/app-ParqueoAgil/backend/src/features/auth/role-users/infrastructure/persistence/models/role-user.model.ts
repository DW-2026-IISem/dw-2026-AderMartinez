import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserModel } from '../../../../users/infrastructure/persistence/models/user.model.js';
import { RoleModel } from '../../../../roles/infrastructure/persistence/models/role.model.js';

/**
 * Modelo `RoleUserModel` (tabla `role_users`) — asignación N:M `User` ↔ `Role`.
 *
 * Es el **primer eslabón** de la cadena de autorización.
 */
@Table({
  tableName: 'role_users',
  timestamps: true,
  indexes: [
    {
      name: 'uq_role_users_user_role',
      unique: true,
      fields: ['user_id', 'role_id'],
    },
    { name: 'ix_role_users_user_id', fields: ['user_id'] },
    { name: 'ix_role_users_role_id', fields: ['role_id'] },
  ],
})
export class RoleUserModel extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare user_id: number;

  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare role_id: number;

  @Column({
    type: DataType.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'inactive',
  })
  declare status: 'active' | 'inactive';
}
