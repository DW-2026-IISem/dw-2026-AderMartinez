import { Component, input, output, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client } from '../../../core/models/client.model';
import { ParkingZone } from '../../../core/models/parking-zone.model';
import { VehicleType } from '../../../core/models/vehicle-type.model';
import { TicketPayload } from '../../../core/models/ticket.model';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ticket-form.html',
  styleUrl: './ticket-form.css'
})
export class TicketForm {
  private fb = inject(NonNullableFormBuilder);

  readonly clients = input<Client[]>([]);
  readonly zones = input<ParkingZone[]>([]);
  readonly vehicleTypes = input<VehicleType[]>([]);
  
  readonly resetKey = input(0);
  readonly saving = input(false);

  readonly saved = output<TicketPayload>();
  readonly cancelled = output<void>();

  form = this.fb.group({
    clientId: [null as number | null, [Validators.required]],
    parkingZoneId: [null as number | null, [Validators.required]],
    vehicleTypeId: [null as number | null, [Validators.required]]
  });

  constructor() {
    effect(() => {
      this.resetKey();
      this.form.reset();
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.saved.emit({
      clientId: Number(value.clientId),
      parkingZoneId: Number(value.parkingZoneId),
      vehicleTypeId: Number(value.vehicleTypeId)
    });
  }
}