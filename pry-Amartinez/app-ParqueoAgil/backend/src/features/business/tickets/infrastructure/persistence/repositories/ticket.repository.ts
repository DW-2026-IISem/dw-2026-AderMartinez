import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../../../../../../infrastructure/database/sequelize/sequelize.module.js';
import { ParkingZoneModel } from '../../../../parking-zones/infrastructure/persistence/models/parking-zone.model.js';
import { ParkingZoneNotFoundException } from '../../../../parking-zones/domain/exceptions/parking-zone-not-found.exception.js';
import { Ticket } from '../../../domain/entities/ticket.entity.js';
import type { TicketStatus } from '../../../domain/entities/ticket.entity.js';
import { ITicketRepository } from '../../../domain/interfaces/ticket.repository.js';
import { TicketNotFoundException } from '../../../domain/exceptions/ticket-not-found.exception.js';
import { TicketCalculator } from '../../../domain/services/ticket-calculator.js';
import { TicketModel } from '../models/ticket.model.js';

@Injectable()
export class TicketRepository implements ITicketRepository {
  private readonly calculator = new TicketCalculator();

  constructor(@Inject(SEQUELIZE) private readonly sequelize: Sequelize) {}

  async createOpen(ticket: Ticket): Promise<Ticket> {
    return this.sequelize.transaction(async (t) => {
      const ticketRepo = this.sequelize.getRepository(TicketModel);
      const zoneRepo = this.sequelize.getRepository(ParkingZoneModel);

      const zone = await zoneRepo.findByPk(ticket.parkingZoneId, {
        lock: Transaction.LOCK.UPDATE,
        transaction: t,
      });
      if (!zone) {
        throw new ParkingZoneNotFoundException(ticket.parkingZoneId);
      }
      if (zone.availableSpots < 1) {
        throw new ParkingZoneNotFoundException(ticket.parkingZoneId);
      }

      const created = await ticketRepo.create(
        {
          clientId: ticket.clientId,
          parkingZoneId: ticket.parkingZoneId,
          entryAt: ticket.entryAt,
          exitAt: null,
          hours: 0,
          hourlyRate: ticket.hourlyRate,
          subtotal: 0,
          tax: ticket.tax,
          discounts: ticket.discounts,
          total: 0,
          status: 'open',
        },
        { transaction: t },
      );

      await zone.update(
        { availableSpots: zone.availableSpots - 1 },
        { transaction: t },
      );

      return this.toDomain(created);
    });
  }

  async closeTicket(id: number, exitAt: Date): Promise<Ticket> {
    return this.sequelize.transaction(async (t) => {
      const ticketRepo = this.sequelize.getRepository(TicketModel);
      const zoneRepo = this.sequelize.getRepository(ParkingZoneModel);

      const current = await ticketRepo.findByPk(id, {
        lock: Transaction.LOCK.UPDATE,
        transaction: t,
      });
      if (!current) {
        throw new TicketNotFoundException(id);
      }

      const hours = this.calculator.hoursBetween(current.entryAt, exitAt);
      const subtotal = this.calculator.subtotal(hours, Number(current.hourlyRate));
      const tax = Number(current.tax);
      const discounts = Number(current.discounts);
      const total = this.calculator.total(subtotal, tax, discounts);

      await current.update(
        {
          exitAt,
          hours,
          subtotal,
          total,
          status: 'closed',
        },
        { transaction: t },
      );

      const zone = await zoneRepo.findByPk(current.parkingZoneId, {
        lock: Transaction.LOCK.UPDATE,
        transaction: t,
      });
      if (zone) {
        const next = zone.availableSpots + 1;
        const capped = next > zone.capacity ? zone.capacity : next;
        await zone.update({ availableSpots: capped }, { transaction: t });
      }

      return this.toDomain(current);
    });
  }

  async findById(id: number): Promise<Ticket | null> {
    const repo = this.sequelize.getRepository(TicketModel);
    const found = await repo.findByPk(id);
    return found ? this.toDomain(found) : null;
  }

  async findOpenByZone(parkingZoneId: number): Promise<Ticket[]> {
    const repo = this.sequelize.getRepository(TicketModel);
    const rows = await repo.findAll({
      where: { parkingZoneId, status: 'open' },
      order: [['id', 'ASC']],
    });
    return rows.map((r) => this.toDomain(r));
  }

  private toDomain(m: TicketModel): Ticket {
    return new Ticket({
      id: m.id,
      clientId: m.clientId,
      parkingZoneId: m.parkingZoneId,
      entryAt: m.entryAt,
      exitAt: m.exitAt ?? null,
      hours: m.hours,
      hourlyRate: Number(m.hourlyRate),
      subtotal: Number(m.subtotal),
      tax: Number(m.tax),
      discounts: Number(m.discounts),
      total: Number(m.total),
      status: (m.status as TicketStatus) ?? 'open',
    });
  }
}
