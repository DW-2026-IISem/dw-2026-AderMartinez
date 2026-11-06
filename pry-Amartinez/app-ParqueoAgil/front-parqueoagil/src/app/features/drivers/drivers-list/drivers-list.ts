import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../core/services/client.service';
import { toApiMessage } from '../../../core/utils/api-error';
import { DriverRow, KIND_LABELS, PAYMENT_LABELS, Page } from '../../../core/models/driver.model';

const PAGE_SIZE = 15;

@Component({
  selector: 'app-drivers-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './drivers-list.html',
  styleUrl: './drivers-list.css'
})
export class DriversList implements OnInit {
  private readonly api = inject(ClientService);
  private requestId = 0;

  protected readonly result = signal<Page<DriverRow> | null>(null);
  protected readonly loading = signal(true);
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly meta = computed(() => this.result()?.meta ?? null);

  protected readonly paymentLabels = PAYMENT_LABELS;
  protected readonly kindLabels = KIND_LABELS;

  ngOnInit(): void {
    this.load(1);
  }

  load(page: number, quiet = false): void {
    const id = ++this.requestId;
    if (!quiet) this.busy.set(true);
    if (!quiet) this.loading.set(true);

    this.api.getDrivers(page, PAGE_SIZE).subscribe({
      next: (res) => {
        if (id !== this.requestId) return;
        this.result.set(res);
        this.error.set(null);
        this.loading.set(false);
        this.busy.set(false);
      },
      error: (err) => {
        if (id !== this.requestId) return;
        this.error.set(toApiMessage(err));
        this.loading.set(false);
        this.busy.set(false);
      }
    });
  }
}