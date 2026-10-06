import {
  BeforeValidate,
  Column,
  DataType,
  Index,
  Model,
  Table,
} from 'sequelize-typescript';
import { normalizePath } from '../../../../../../shared/auth/resource-match.js';

/**
 * Modelo `ResourceModel` (tabla `resources`) — un punto de acceso protegible.
 *
 * Un recurso **no** es una entidad de negocio: es el par `(method, path)`.
 * `GET /api/tickets` y `POST /api/tickets` son **dos recursos distintos**.
 */
@Table({
  tableName: 'resources',
  timestamps: true,
  indexes: [
    {
      name: 'uq_resources_method_path',
      unique: true,
      fields: ['method', 'path'],
    },
  ],
})
export class ResourceModel extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  declare method: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare path: string;

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
  static normalize(resource: ResourceModel): void {
    if (resource.method) resource.method = resource.method.trim().toUpperCase();
    if (resource.path) resource.path = normalizePath(resource.path.trim());
  }
}
