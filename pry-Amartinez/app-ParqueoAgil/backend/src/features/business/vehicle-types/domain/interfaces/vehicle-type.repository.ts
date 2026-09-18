import { VehicleType } from '../entities/vehicle-type.entity.js';

export const VEHICLE_TYPE_REPOSITORY = 'IVehicleTypeRepository';

export interface IVehicleTypeRepository {
  create(vehicleType: VehicleType): Promise<VehicleType>;
  findAll(page: number, limit: number): Promise<{ items: VehicleType[]; total: number }>;
  findById(id: number): Promise<VehicleType | null>;
  findByName(name: string): Promise<VehicleType | null>;
  count(): Promise<number>;
}
