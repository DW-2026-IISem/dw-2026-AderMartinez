import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { VehicleTypeService } from '../../../core/services/vehicle-type.service';
import { VehicleType, VehicleTypePayload } from '../../../core/models/vehicle-type.model';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { VehicleTypeForm } from '../vehicle-type-form/vehicle-type-form';
import { filterRows } from '../../../core/utils/filter-rows';
import { toApiMessage } from '../../../core/utils/api-error';

@Component({
  selector: 'app-vehicle-type-list',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusTag, PageHeader, VehicleTypeForm, ToastModule, ConfirmDialogModule],
  templateUrl: './vehicle-type-list.html',
  styleUrl: './vehicle-type-list.css',
  providers: [ConfirmationService, MessageService]
})
export class VehicleTypeList implements OnInit {
  private service = inject(VehicleTypeService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  public items = signal<VehicleType[]>([]);
  public isLoading = signal(true);
  public errorMessage = signal('');

  public searchTerm = signal('');
  public visibleItems = computed(() =>
    filterRows(this.items(), this.searchTerm(), (v) => [v.name, v.description])
  );

  public isModalOpen = signal(false);
  public itemToEdit = signal<VehicleType | null>(null);
  public resetKey = signal(0);

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.service.list().subscribe({
      next: (data) => {
        this.items.set([...data]);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(toApiMessage(err));
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal() {
    this.itemToEdit.set(null);
    this.resetKey.update(k => k + 1);
    this.isModalOpen.set(true);
  }

  openEditModal(item: VehicleType) {
    this.itemToEdit.set(item);
    this.resetKey.update(k => k + 1);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  save(event: { id?: number; payload: VehicleTypePayload }) {
    const request = event.id
      ? this.service.update(event.id, event.payload)
      : this.service.create(event.payload);

    request.subscribe({
      next: () => {
        this.closeModal();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tipo de vehículo guardado' });
        this.load();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: toApiMessage(err) });
      }
    });
  }

 deleteItem(item: VehicleType) {
    this.confirmationService.confirm({
      message: `¿Desactivar el tipo de vehículo "${item.name}"?`,
      header: 'Confirmar baja',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        // Usamos deactivate en lugar de delete
        this.service.deactivate(item.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Desactivado', detail: 'Tipo de vehículo desactivado' });
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