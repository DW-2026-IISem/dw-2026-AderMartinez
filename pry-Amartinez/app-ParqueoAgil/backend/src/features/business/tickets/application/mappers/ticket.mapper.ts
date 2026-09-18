import { Ticket } from '../../domain/entities/ticket.entity.js';

export class TicketMapper {
  static toResponse(t: Ticket) {
    return {
      id: t.id,
      clientId: t.clientId,
      parkingZoneId: t.parkingZoneId,
      entryAt: t.entryAt,
      exitAt: t.exitAt,
      hours: t.hours,
      hourlyRate: t.hourlyRate,
      subtotal: t.subtotal,
      tax: t.tax,
      discounts: t.discounts,
      total: t.total,
      status: t.status,
    };
  }
}
