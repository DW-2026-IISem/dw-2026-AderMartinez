import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  public authService = inject(AuthService);

  // Simulamos el estado del dashboard
  public summary = signal<any>({
    occupancy: {
      occupied: 45,
      capacity: 50,
      free: 5,
      blocked: 0,
      zones: [
        { id: 1, name: 'Zona A (Carros)', code: 'A', color: '#3b82f6', occupied: 20, capacity: 25 },
        { id: 2, name: 'Zona B (Motos)', code: 'B', color: '#8b5cf6', occupied: 15, capacity: 15 },
        { id: 3, name: 'Zona C (Camionetas)', code: 'C', color: '#f59e0b', occupied: 10, capacity: 10 },
      ]
    },
    today: {
      revenue: 450000,
      exits: 34,
      entries: 42,
      avgMinutes: 115
    },
    entriesByHour: [2, 5, 8, 12, 15, 18, 22, 10, 5, 2]
  });

  // Feed simulado
  public feed = signal<any[]>([
    { id: 1, kind: 'in', ticket: { plate: 'ABC-123', spotCode: 'A-01' }, at: new Date() },
    { id: 2, kind: 'out', ticket: { plate: 'XYZ-987', spotCode: 'B-05', total: 4500 }, at: new Date(Date.now() - 300000) },
    { id: 3, kind: 'in', ticket: { plate: 'QWE-456', spotCode: 'C-02' }, at: new Date(Date.now() - 600000) },
  ]);

  public error = signal<string | null>(null);

  // Computados
  public occupancyPct = computed(() => {
    const s = this.summary();
    if (!s || s.occupancy.capacity === 0) return 0;
    return Math.round((s.occupancy.occupied / s.occupancy.capacity) * 100);
  });

  public methods = computed(() => [
    { code: 'cash', label: 'Efectivo', amount: 250000, pct: 55 },
    { code: 'card', label: 'Tarjeta', amount: 150000, pct: 33 },
    { code: 'transfer', label: 'Transferencia', amount: 50000, pct: 12 },
  ]);

  public zonePct(occupied: number, capacity: number): number {
    if (capacity === 0) return 0;
    return Math.round((occupied / capacity) * 100);
  }

  public load() {
    // Aquí iría la petición HTTP real en el futuro
    console.log('Actualizando datos...');
  }
}