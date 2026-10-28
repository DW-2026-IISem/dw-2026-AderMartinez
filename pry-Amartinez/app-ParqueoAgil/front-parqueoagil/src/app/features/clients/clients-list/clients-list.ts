import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models/client.model';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { toApiMessage } from '../../../core/utils/api-error';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, StatusTag, PageHeader],
  templateUrl: './clients-list.html',
  styleUrl: './clients-list.css'
})
export class ClientsList implements OnInit {
  private clientService = inject(ClientService);

  public clients = signal<Client[]>([]);
  public isLoading = signal(true);
  public errorMessage = signal('');

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    
    // Ahora 'clients' es directamente el arreglo
    this.clientService.list().subscribe({
      next: (data) => {
        this.clients.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(toApiMessage(err));
        this.isLoading.set(false);
      }
    });
  }
}