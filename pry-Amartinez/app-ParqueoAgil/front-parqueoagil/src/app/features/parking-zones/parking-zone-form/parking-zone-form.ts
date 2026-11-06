import { Component, input, output, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ParkingZone, ParkingZonePayload } from '../../../core/models/parking-zone.model';
import { VehicleType } from '../../../core/models/vehicle-type.model';

@Component({
  selector: 'app-parking-zone-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './parking-zone-form.html',
  styleUrl: './parking-zone-form.css'
})
export class ParkingZoneForm {
  private fb = inject(NonNullableFormBuilder);

  readonly parkingZone = input<ParkingZone | null>(null);
  readonly vehicleTypes = input<VehicleType[]>([]); // Recibe los tipos de vehículo
  readonly resetKey = input(0);
  readonly saving = input(false);

  readonly saved = output<{ id?: number; payload: ParkingZonePayload }>();
  readonly cancelled = output<void>();

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    capacity: [0, [Validators.required, Validators.min(1)]],
    hourlyRate: [0, [Validators.required, Validators.min(1)]],
    vehicleTypeId: [null as number | null, [Validators.required]]
  });

  constructor() {
    effect(() => {
      const current = this.parkingZone();
      this.resetKey();

      this.form.reset({
        name: current?.name ?? '',
        capacity: current?.capacity ?? 0,
        hourlyRate: current?.hourlyRate ?? 0,
        vehicleTypeId: current?.vehicleTypeId ?? null
      });
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.saved.emit({
      id: this.parkingZone()?.id,
      payload: {
        name: value.name.trim(),
        capacity: Number(value.capacity),
        hourlyRate: Number(value.hourlyRate),
        vehicleTypeId: Number(value.vehicleTypeId)
      }
    });
  }
}