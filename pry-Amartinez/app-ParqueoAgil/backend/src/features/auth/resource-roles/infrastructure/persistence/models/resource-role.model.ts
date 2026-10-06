import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { RoleModel } from '../../../../roles/infrastructure/persistence/models/role.model.js';
import { ResourceModel } from '../../../../resources/infrastructure/persistence/models/resource.model.js';

/**
 * Modelo `ResourceRoleModel` (tabla `resource_roles`) — la **concesión** `Role` ↔ `Resource`.
 *
 * Esta tabla **es el permiso**. No existe una entidad `Permission`.
 */
@Table({
  tableName: 'resource_roles',
  timestamps: true,
  indexes: [
    {
      name: 'uq_resource_roles_role_resource',
      unique: true,
      fields: ['role_id', 'resource_id'],
    },
    { name: 'ix_resource_roles_role_id', fields: ['role_id'] },
    { name: 'ix_resource_roles_resource_id', fields: ['resource_id'] },
  ],
})
export class ResourceRoleModel extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => RoleModel)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare role_id: number;

  @ForeignKey(() => ResourceModel)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare resource_id: number;

  @Column({
    type: DataType.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'inactive',
  })
  declare status: 'active' | 'inactive';
}
