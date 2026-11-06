export interface ParkingZone {
  id: number;
  name: string;
  capacity: number;
  hourlyRate: number;
  vehicleTypeId: number; 
  status: 'active' | 'inactive';
}

export interface ParkingZonePayload {
  name: string;
  capacity: number;
  hourlyRate: number;
  vehicleTypeId: number;
  status?: 'active' | 'inactive';
}