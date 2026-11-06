import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { forkJoin } from 'rxjs';

import { TicketService } from '../../../core/services/ticket.service';
import { ClientService } from '../../../core/services/client.service';
import { ParkingZoneService } from '../../../core/services/parking-zone.service';
import { VehicleTypeService } from '../../../core/services/vehicle-type.service';

import { Ticket, TicketPayload } from '../../../core/models/ticket.model';
import { Client } from '../../../core/models/client.model';
import { ParkingZone } from '../../../core/models/parking-zone.model';
import { VehicleType } from '../../../core/models/vehicle-type.model';

import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { TicketForm } from '../ticket-form/ticket-form';
import { toApiMessage } from '../../../core/utils/api-error';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, PageHeader, TicketForm, ToastModule, ConfirmDialogModule],
  templateUrl: './ticket-list.html',
  styleUrl: './ticket-list.css',
  providers: [ConfirmationService, MessageService]
})
export class TicketList implements OnInit {
  private ticketService = inject(TicketService);
  private clientService = inject(ClientService);
  private zoneService = inject(ParkingZoneService);
  private vehicleTypeService = inject(VehicleTypeService);
  
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  public tickets = signal<Ticket[]>([]);
  public clients = signal<Client[]>([]);
  public zones = signal<ParkingZone[]>([]);
  public vehicleTypes = signal<VehicleType[]>([]);
  
  public isLoading = signal(true);
  public errorMessage = signal('');

  public isModalOpen = signal(false);
  public resetKey = signal(0);

  // Mapas para resolver nombres en la tabla
  public getClientName = computed(() => {
    const map = new Map(this.clients().map(c => [c.id, c.name]));
    return (id: number) => map.get(id) ?? `Cliente #${id}`;
  });

  public getZoneName = computed(() => {
    const map = new Map(this.zones().map(z => [z.id, z.name]));
    return (id: number) => map.get(id) ?? `Zona #${id}`;
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    forkJoin({
      tickets: this.ticketService.list(),
      clients: this.clientService.list(),
      zones: this.zoneService.list(),
      types: this.vehicleTypeService.list()
    }).subscribe({
      next: (res) => {
        this.tickets.set(res.tickets);
        this.clients.set(res.clients);
        this.zones.set(res.zones);
        this.vehicleTypes.set(res.types);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(toApiMessage(err));
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal() {
    this.resetKey.update(k => k + 1);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  save(payload: TicketPayload) {
    this.ticketService.create(payload).subscribe({
      next: () => {
        this.closeModal();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Entrada registrada' });
        this.load();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: toApiMessage(err) });
      }
    });
  }

  closeTicket(ticket: Ticket) {
    this.confirmationService.confirm({
      message: `¿Cobrar y cerrar el ticket #${ticket.id}?`,
      header: 'Confirmar Salida',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-success',
      accept: () => {
        this.ticketService.close(ticket.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Cobrado', detail: 'Ticket cerrado' });
            this.load();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: toApiMessage(err) });
          }
        });
      }
    });
  }
}