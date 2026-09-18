import { Sequelize } from 'sequelize-typescript';
import { getDbBlock } from '../../../config/environment/db-env.js';
import { IEnvConfig } from '../../../config/environment/env.interface.js';
import { ClientModel } from '../../../features/business/clients/infrastructure/persistence/models/client.model.js';
import { VehicleTypeModel } from '../../../features/business/vehicle-types/infrastructure/persistence/models/vehicle-type.model.js';
import { ParkingZoneModel } from '../../../features/business/parking-zones/infrastructure/persistence/models/parking-zone.model.js';

export const ALL_MODELS: any[] = [
  ClientModel,
  VehicleTypeModel,
  ParkingZoneModel,
];

export function sequelizeFactory(cfg: IEnvConfig): Sequelize {
  const block = getDbBlock(cfg);
  const options: Record<string, unknown> = {
    dialect: cfg.dbDialect,
    host: block.host,
    port: block.port,
    username: block.username,
    password: block.password,
    database: block.name,
    models: ALL_MODELS,
    logging: false,
  };
  if (cfg.dbDialect === 'oracle' && block.connectString) {
    options.connectString = block.connectString;
  }
  return new Sequelize(options);
}
