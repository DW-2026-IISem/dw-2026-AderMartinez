import { Ticket } from '../entities/ticket.entity.js';

export const TICKET_REPOSITORY = 'ITicketRepository';

export interface ITicketRepository {
  createOpen(ticket: Ticket): Promise<Ticket>;
  closeTicket(id: number, exitAt: Date): Promise<Ticket>;
  findById(id: number): Promise<Ticket | null>;
  findOpenByZone(parkingZoneId: number): Promise<Ticket[]>;
}
