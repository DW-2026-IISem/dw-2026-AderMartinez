import { Inject, Injectable } from '@nestjs/common';
import { TicketNotFoundException } from '../../domain/exceptions/ticket-not-found.exception.js';
import { TICKET_REPOSITORY } from '../../domain/interfaces/ticket.repository.js';
import type { ITicketRepository } from '../../domain/interfaces/ticket.repository.js';
import type { Ticket } from '../../domain/entities/ticket.entity.js';

@Injectable()
export class GetTicketByIdUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY) private readonly ticketRepo: ITicketRepository,
  ) {}

  async execute(id: number): Promise<Ticket> {
    const ticket = await this.ticketRepo.findById(id);
    if (!ticket) {
      throw new TicketNotFoundException(id);
    }
    return ticket;
  }
}
