import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-tag',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="px-2 py-1 rounded-full text-xs font-bold"
      [ngClass]="status() === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
      {{ label() }}
    </span>
  `
})
export class StatusTag {
  readonly status = input.required<'active' | 'inactive'>();
  readonly label = computed(() => this.status() === 'active' ? 'Activo' : 'Inactivo');
}