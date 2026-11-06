import { Component, input, output, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehicleType, VehicleTypePayload } from '../../../core/models/vehicle-type.model';

@Component({
  selector: 'app-vehicle-type-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicle-type-form.html',
  styleUrl: './vehicle-type-form.css'
})
export class VehicleTypeForm {
  private fb = inject(NonNullableFormBuilder);

  readonly vehicleType = input<VehicleType | null>(null);
  readonly resetKey = input(0);
  readonly saving = input(false);

  readonly saved = output<{ id?: number; payload: VehicleTypePayload }>();
  readonly cancelled = output<void>();

  // El formulario con el campo hourlyRate incluido
  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.maxLength(255)]],
    hourlyRate: [0, [Validators.required, Validators.min(1)]]
  });

  constructor() {
    effect(() => {
      const current = this.vehicleType();
      this.resetKey();

      this.form.reset({
        name: current?.name ?? '',
        description: current?.description ?? '',
        hourlyRate: current?.hourlyRate ?? 0
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
      id: this.vehicleType()?.id,
      payload: {
        name: value.name.trim(),
        description: value.description.trim() || null,
        hourlyRate: Number(value.hourlyRate)
      }
    });
  }
}