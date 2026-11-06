import { Component, input, output, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client, ClientPayload } from '../../../core/models/client.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-form.html',
  styleUrl: './client-form.css'
})
export class ClientForm {
  private fb = inject(NonNullableFormBuilder);

  // Recibimos el cliente (null si es nuevo)
  readonly client = input<Client | null>(null);
  
  // Recibimos el resetKey para forzar la limpieza del formulario
  readonly resetKey = input(0);

  // Emitimos cuando se guarda (con el payload y el ID)
  readonly saved = output<{ id?: number; payload: ClientPayload }>();
  readonly cancelled = output<void>();

  // Formulario Reactivo
  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
    email: ['', [Validators.email]],
    phone: ['', [Validators.maxLength(30)]],
    address: ['', [Validators.maxLength(255)]]
  });

  constructor() {
    // Effect para llenar el formulario si estamos editando
    effect(() => {
      const c = this.client();
      this.resetKey(); // Leemos el resetKey para que el effect reaccione al cambio

      if (c) {
        this.form.patchValue({
          name: c.name,
          email: c.email || '',
          phone: c.phone || '',
          address: c.address || ''
        });
      } else {
        this.form.reset();
      }
    });
  }

  get isEditing() {
    return !!this.client();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Muestra los errores
      return;
    }

    const value = this.form.getRawValue();
    this.saved.emit({
      id: this.client()?.id,
      payload: {
        name: value.name.trim(),
        email: value.email.trim() || null,
        phone: value.phone.trim() || null,
        address: value.address.trim() || null
      }
    });
  }
}