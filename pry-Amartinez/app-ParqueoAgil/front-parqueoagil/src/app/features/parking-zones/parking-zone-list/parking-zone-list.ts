import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { forkJoin } from 'rxjs';

import { ParkingZoneService } from '../../../core/services/parking-zone.service';
import { VehicleTypeService } from '../../../core/services/vehicle-type.service';
import { ParkingZone, ParkingZonePayload } from '../../../core/models/parking-zone.model';
import { VehicleType } from '../../../core/models/vehicle-type.model';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { ParkingZoneForm } from '../parking-zone-form/parking-zone-form';
import { filterRows } from '../../../core/utils/filter-rows';
import { toApiMessage } from '../../../core/utils/api-error';

@Component({
  selector: 'app-parking-zone-list',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusTag, PageHeader, ParkingZoneForm, ToastModule, ConfirmDialogModule],
  templateUrl: './parking-zone-list.html',
  styleUrl: './parking-zone-list.css',
  providers: [ConfirmationService, MessageService]
})
export class ParkingZoneList implements OnInit {
  private zoneService = inject(ParkingZoneService);
  private vehicleTypeService = inject(VehicleTypeService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  public items = signal<ParkingZone[]>([]);
  public vehicleTypes = signal<VehicleType[]>([]); // Para el select
  public isLoading = signal(true);
  public errorMessage = signal('');

  public searchTerm = signal('');
  public visibleItems = computed(() =>
    filterRows(this.items(), this.searchTerm(), (z) => [z.name])
  );

  // Mapa para resolver el nombre del tipo de vehículo rápido
  public typeName = computed(() => {
    const map = new Map(this.vehicleTypes().map(t => [t.id, t.name]));
    return (id: number) => map.get(id) ?? `Tipo #${id}`;
  });

  public isModalOpen = signal(false);
  public itemToEdit = signal<ParkingZone | null>(null);
  public resetKey = signal(0);

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    // Cargamos Zonas y Tipos de Vehículo en paralelo
    forkJoin({
      zones: this.zoneService.list(),
      types: this.vehicleTypeService.list()
    }).subscribe({
      next: (res) => {
        this.items.set([...res.zones]);
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
    this.itemToEdit.set(null);
    this.resetKey.update(k => k + 1);
    this.isModalOpen.set(true);
  }

  openEditModal(item: ParkingZone) {
    this.itemToEdit.set(item);
    this.resetKey.update(k => k + 1);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  save(event: { id?: number; payload: ParkingZonePayload }) {
    const request = event.id
      ? this.zoneService.update(event.id, event.payload)
      : this.zoneService.create(event.payload);

    request.subscribe({
      next: () => {
        this.closeModal();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Zona guardada' });
        this.load();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: toApiMessage(err) });
      }
    });
  }

  deleteItem(item: ParkingZone) {
    this.confirmationService.confirm({
      message: `¿Desactivar la zona "${item.name}"?`,
      header: 'Confirmar baja',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.zoneService.deactivate(item.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Desactivado', detail: 'Zona desactivada' });
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