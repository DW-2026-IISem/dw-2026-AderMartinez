import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Client, ClientPayload } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/clients`;

  // 1. Listar: Desenvuelve { data: { clients: [] } } y devuelve solo Client[]
  list(): Observable<Client[]> {
    return this.http.get<{ data: { clients: Client[] } }>(this.base)
      .pipe(map(res => res.data.clients));
  }

  // 2. Obtener uno: Desenvuelve y devuelve solo Client
  get(id: number): Observable<Client> {
    return this.http.get<{ data: { client: Client } }>(`${this.base}/${id}`)
      .pipe(map(res => res.data.client));
  }

  // 3. Crear
  create(payload: ClientPayload): Observable<Client> {
    return this.http.post<{ data: { client: Client } }>(this.base, payload)
      .pipe(map(res => res.data.client));
  }

  // 4. Actualizar (PATCH)
  update(id: number, payload: Partial<ClientPayload>): Observable<Client> {
    return this.http.patch<{ data: { client: Client } }>(`${this.base}/${id}`, payload)
      .pipe(map(res => res.data.client));
  }

  // 5. Desactivar (Baja lógica)
  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  // 6. Eliminar (Baja física)
  delete(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}