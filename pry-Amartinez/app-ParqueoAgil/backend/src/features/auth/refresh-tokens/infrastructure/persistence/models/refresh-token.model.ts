import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserModel } from '../../../../users/infrastructure/persistence/models/user.model.js';

/**
 * Modelo `RefreshTokenModel` (tabla `refresh_tokens`) — sesión renovable y revocable.
 *
 * Es el **único** artefacto de sesión que se persiste. El access token (JWT) es
 * autocontenido y no se guarda.
 *
 * Desviación deliberada: `status` predetermina **`active`**.
 */
@Table({
  tableName: 'refresh_tokens',
  timestamps: true,
  indexes: [
    { name: 'ix_refresh_tokens_family_id', fields: ['family_id'] },
    { name: 'ix_refresh_tokens_user_id', fields: ['user_id'] },
  ],
})
export class RefreshTokenModel extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare user_id: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: 'uq_refresh_tokens_token_hash',
  })
  declare token_hash: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare family_id: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  declare device_info: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare expires_at: Date;

  @Column({
    type: DataType.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active',
  })
  declare status: 'active' | 'inactive';
}
