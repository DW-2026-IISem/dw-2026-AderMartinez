export type VehicleTypeStatus = 'active' | 'inactive';

export interface VehicleTypeProps {
  id?: number | null;
  name: string;
  hourlyRate: number;
  description?: string | null;
  status?: VehicleTypeStatus;
}

export class VehicleType {
  readonly id: number | null;
  readonly name: string;
  readonly hourlyRate: number;
  readonly description: string | null;
  readonly status: VehicleTypeStatus;

  constructor(props: VehicleTypeProps) {
    this.id = props.id ?? null;
    this.name = props.name;
    this.hourlyRate = props.hourlyRate;
    this.description = props.description ?? null;
    this.status = props.status ?? 'active';
  }
}
