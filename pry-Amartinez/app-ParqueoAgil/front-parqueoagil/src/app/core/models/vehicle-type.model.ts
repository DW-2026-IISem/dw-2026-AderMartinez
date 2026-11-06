export interface VehicleType {
  id: number;
  name: string;
  description: string | null;
  hourlyRate: number; // <-- NUEVO
  status: 'active' | 'inactive';
}

export interface VehicleTypePayload {
  name: string;
  description?: string | null;
  hourlyRate: number; // <-- NUEVO
  status?: 'active' | 'inactive';
}