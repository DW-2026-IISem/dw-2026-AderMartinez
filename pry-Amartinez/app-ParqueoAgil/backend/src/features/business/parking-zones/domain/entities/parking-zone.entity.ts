import { NoAvailableSpotsException } from '../exceptions/no-available-spots.exception.js';

export type ParkingZoneStatus = 'active' | 'inactive';

export interface ParkingZoneProps {
  id?: number | null;
  name: string;
  vehicleTypeId: number;
  capacity: number;
  availableSpots: number;
  hourlyRate: number;
  status?: ParkingZoneStatus;
}

export class ParkingZone {
  readonly id: number | null;
  readonly name: string;
  readonly vehicleTypeId: number;
  readonly capacity: number;
  availableSpots: number;
  readonly hourlyRate: number;
  readonly status: ParkingZoneStatus;

  constructor(props: ParkingZoneProps) {
    this.id = props.id ?? null;
    this.name = props.name;
    this.vehicleTypeId = props.vehicleTypeId;
    this.capacity = props.capacity;
    this.availableSpots = props.availableSpots;
    this.hourlyRate = props.hourlyRate;
    this.status = props.status ?? 'active';
  }

  occupySpot(n = 1): void {
    if (n < 1) {
      throw new NoAvailableSpotsException(this.id, this.availableSpots, n);
    }
    if (this.availableSpots - n < 0) {
      throw new NoAvailableSpotsException(this.id, this.availableSpots, n);
    }
    this.availableSpots -= n;
  }

  releaseSpot(n = 1): void {
    if (n < 1) {
      return;
    }
    const next = this.availableSpots + n;
    this.availableSpots = next > this.capacity ? this.capacity : next;
  }
}
