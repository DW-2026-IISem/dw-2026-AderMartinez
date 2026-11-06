export type VehicleKind = 'car' | 'motorcycle' | 'truck';
export type PaymentMethod = 'cash' | 'card' | 'transfer';

export const KIND_LABELS: Record<VehicleKind, string> = {
  car: 'Automóvil',
  motorcycle: 'Motocicleta',
  truck: 'Camioneta'
};

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cash: 'Efectivo',
  card: 'Tarjeta',
  transfer: 'Transferencia'
};

export interface Vehicle {
  id: number;
  plate: string;
  kind: VehicleKind;
}

export interface DriverRow {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  docType: string;
  docNumber: string;
  vehicles: Vehicle[];
  paymentMethod: PaymentMethod;
  hasCard: boolean;
  activeTickets: number;
  createdAt: string;
}

export interface PageMeta {
  page: number;
  total: number;
  totalPages: number;
}

export interface Page<T> {
  items: T[];
  meta: PageMeta;
}