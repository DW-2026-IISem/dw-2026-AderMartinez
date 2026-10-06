import {
  BeforeValidate,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

/**
 * Modelo `RoleModel` (tabla `roles`) — agrupador lógico de responsabilidades.
 *
 * Nota de diseño: **el nombre del rol no autoriza nada**. La autorización se
 * decide por las concesiones (`resource_roles`) asociadas al rol.
 */
@Table({
  tableName: 'roles',
  timestamps: true,
})
export class RoleModel extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(80),
    allowNull: false,
    unique: 'uq_roles_name',
  })
  declare name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare description: string | null;

  @Column({
    type: DataType.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'inactive',
  })
  declare status: 'active' | 'inactive';

  @BeforeValidate
  static normalizeName(role: RoleModel): void {
    if (role.name) role.name = role.name.trim().toUpperCase();
  }
}
