import { Inject, Injectable } from '@nestjs/common';
import { TICKET_REPOSITORY } from '../../domain/interfaces/ticket.repository.js';
import type { ITicketRepository } from '../../domain/interfaces/ticket.repository.js';
import { TicketMapper } from '../mappers/ticket.mapper.js';

@Injectable()
export class ListTicketsUseCase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly repository: ITicketRepository,
  ) {}

  async execute(page: number, limit: number) {
    const { items, total } = await this.repository.findAll(page, limit);
    return {
      tickets: items.map(TicketMapper.toResponse),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }
}