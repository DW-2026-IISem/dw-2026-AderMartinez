import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ClientModel } from '../../../../clients/infrastructure/persistence/models/client.model.js';
import { ParkingZoneModel } from '../../../../parking-zones/infrastructure/persistence/models/parking-zone.model.js';

@Table({ tableName: 'tickets', timestamps: true })
export class TicketModel extends Model {
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true })
  declare id: number;

  @ForeignKey(() => ClientModel)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare clientId: number;

  @BelongsTo(() => ClientModel)
  client?: ClientModel;

  @ForeignKey(() => ParkingZoneModel)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare parkingZoneId: number;

  @BelongsTo(() => ParkingZoneModel)
  parkingZone?: ParkingZoneModel;

  @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
  declare entryAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  declare exitAt: Date | null;

  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 })
  declare hours: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare hourlyRate: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false, defaultValue: 0 })
  declare subtotal: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false, defaultValue: 0 })
  declare tax: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false, defaultValue: 0 })
  declare discounts: number;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false, defaultValue: 0 })
  declare total: number;

  @Column({ type: DataType.STRING(20), allowNull: false, defaultValue: 'open' })
  declare status: string;
}
