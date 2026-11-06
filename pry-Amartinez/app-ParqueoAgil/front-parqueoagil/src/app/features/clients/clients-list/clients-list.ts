import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api'; 
import { ClientService } from '../../../core/services/client.service';
import { Client, ClientPayload } from '../../../core/models/client.model';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { ClientForm } from '../client-form/client-form';
import { filterRows } from '../../../core/utils/filter-rows';
import { toApiMessage } from '../../../core/utils/api-error';
import { ToastModule } from 'primeng/toast'; 
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusTag, PageHeader, ClientForm, ToastModule, ConfirmDialogModule],
  templateUrl: './clients-list.html',
  styleUrl: './clients-list.css',
  providers: [ConfirmationService, MessageService] // <-- NUEVO
})
export class ClientsList implements OnInit {
  private clientService = inject(ClientService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  // Estado
  public clients = signal<Client[]>([]);
  public isLoading = signal(true);
  public errorMessage = signal('');
  
  // Filtro (Actualizado a la nueva firma de filterRows)
  public searchTerm = signal('');
  public visibleClients = computed(() => 
    filterRows(this.clients(), this.searchTerm(), (c) => [c.name, c.email, c.phone, c.address])
  );

  // Modal
  public isModalOpen = signal(false);
  public clientToEdit = signal<Client | null>(null);
  public resetKey = signal(0); // Para limpiar el form al abrir/cerrar

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    
    this.clientService.list().subscribe({
      next: (data) => {
        this.clients.set([...data]);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(toApiMessage(err));
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal() {
    this.clientToEdit.set(null);
    this.resetKey.update(k => k + 1); // Fuerza a limpiar el form
    this.isModalOpen.set(true);
  }

  openEditModal(client: Client) {
    this.clientToEdit.set(client);
    this.resetKey.update(k => k + 1); // Fuerza a cargar los datos
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  saveClient(event: { id?: number; payload: ClientPayload }) {
    const request = event.id 
      ? this.clientService.update(event.id, event.payload)
      : this.clientService.create(event.payload);

    request.subscribe({
      next: () => {
        this.closeModal();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente guardado correctamente' });
        this.loadClients(); // Recargamos la lista
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: toApiMessage(err) });
      }
    });
  }

  deleteClient(client: Client) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar a ${client.name}? Esta acción no se puede deshacer.`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.clientService.delete(client.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Cliente eliminado' });
            this.loadClients();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: toApiMessage(err) });
          }
        });
      }
    });
  }
}