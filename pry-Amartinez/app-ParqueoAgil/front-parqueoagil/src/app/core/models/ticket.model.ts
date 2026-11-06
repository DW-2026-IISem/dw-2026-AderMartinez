export interface Ticket {
  id: number;
  clientId: number;
  parkingZoneId: number;
  vehicleTypeId: number;
  entryTime: string;
  exitTime: string | null;
  totalPaid: number | null;
  status: 'active' | 'inactive' | 'closed';
}

export interface TicketPayload {
  clientId: number;
  parkingZoneId: number;
  vehicleTypeId: number;
}