import { Inject, Injectable } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../domain/interfaces/ticket.repository.js';
import type { ITicketRepository } from '../../domain/interfaces/ticket.repository.js';
import { TicketNotFoundException } from '../../domain/exceptions/ticket-not-found.exception.js';
import { TicketAlreadyClosedException } from '../../domain/exceptions/ticket-already-closed.exception.js';
import { TicketCalculator } from '../../domain/services/ticket-calculator.js';
import type { Ticket } from '../../domain/entities/ticket.entity.js';
import { CloseTicketDto } from '../dto/close-ticket.dto.js';

@Injectable()
export class CloseTicketUseCase {
  private readonly calculator = new TicketCalculator();

  constructor(
    @Inject(TICKET_REPOSITORY) private readonly ticketRepo: ITicketRepository,
  ) {}

  async execute(id: number, dto: CloseTicketDto): Promise<Ticket> {
    const ticket = await this.ticketRepo.findById(id);
    if (!ticket) {
      throw new TicketNotFoundException(id);
    }
    if (ticket.status === 'closed') {
      throw new TicketAlreadyClosedException(id);
    }

    const exitAt = new Date();
    const hours = this.calculator.hoursBetween(ticket.entryAt, exitAt);
    const subtotal = this.calculator.subtotal(hours, ticket.hourlyRate);
    const tax = dto.tax ?? ticket.tax;
    const discounts = dto.discounts ?? ticket.discounts;
    const total = this.calculator.total(subtotal, tax, discounts);

    return this.ticketRepo.closeTicket(id, exitAt);
  }
}
