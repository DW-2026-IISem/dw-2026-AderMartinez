import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { VehicleTypeModel } from '../../../../vehicle-types/infrastructure/persistence/models/vehicle-type.model.js';

@Table({ tableName: 'parking_zones', timestamps: true })
export class ParkingZoneModel extends Model {
  @Column({ type: DataType.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true })
  declare id: number;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare name: string;

  @ForeignKey(() => VehicleTypeModel)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare vehicleTypeId: number;

  @BelongsTo(() => VehicleTypeModel)
  vehicleType?: VehicleTypeModel;

  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare capacity: number;

  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 })
  declare availableSpots: number;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false })
  declare hourlyRate: number;

  @Column({ type: DataType.STRING(20), allowNull: false, defaultValue: 'active' })
  declare status: string;
}
