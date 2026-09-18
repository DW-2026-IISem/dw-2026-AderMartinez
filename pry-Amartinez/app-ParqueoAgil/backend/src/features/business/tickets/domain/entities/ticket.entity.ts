export type TicketStatus = 'open' | 'closed';

export interface TicketProps {
  id?: number | null;
  clientId: number;
  parkingZoneId: number;
  entryAt: Date;
  exitAt?: Date | null;
  hours?: number;
  hourlyRate: number;
  subtotal: number;
  tax: number;
  discounts: number;
  total: number;
  status?: TicketStatus;
}

export class Ticket {
  readonly id: number | null;
  readonly clientId: number;
  readonly parkingZoneId: number;
  readonly entryAt: Date;
  readonly exitAt: Date | null;
  readonly hours: number;
  readonly hourlyRate: number;
  readonly subtotal: number;
  readonly tax: number;
  readonly discounts: number;
  readonly total: number;
  readonly status: TicketStatus;

  constructor(props: TicketProps) {
    this.id = props.id ?? null;
    this.clientId = props.clientId;
    this.parkingZoneId = props.parkingZoneId;
    this.entryAt = props.entryAt;
    this.exitAt = props.exitAt ?? null;
    this.hours = props.hours ?? 0;
    this.hourlyRate = props.hourlyRate;
    this.subtotal = props.subtotal;
    this.tax = props.tax;
    this.discounts = props.discounts;
    this.total = props.total;
    this.status = props.status ?? 'open';
  }
}
