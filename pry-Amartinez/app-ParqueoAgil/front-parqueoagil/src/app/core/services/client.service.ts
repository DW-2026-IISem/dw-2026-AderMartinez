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
    
  // Simulamos el endpoint de conductores (que en el futuro unirá clients + tickets)
  getDrivers(page: number, limit: number): Observable<any> {
    return this.http.get<{ data: { clients: any[] } }>(this.base).pipe(
      map(res => {
        // Transformamos los clientes en "conductores" para que coincida con el diseño
        const drivers = res.data.clients.map((c: any, index: number) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          docType: 'CC',
          docNumber: `10${c.id}45678`,
          vehicles: [
            { id: 1, plate: `ABC-${c.id}00`, kind: 'car' }
          ],
          paymentMethod: 'cash',
          hasCard: false,
          activeTickets: index % 3 === 0 ? 1 : 0, // Simulamos que algunos están dentro
          createdAt: c.createdAt || new Date().toISOString()
        }));

        // Paginación en el frontend
        const start = (page - 1) * limit;
        const items = drivers.slice(start, start + limit);

        return {
          items,
          meta: {
            page,
            total: drivers.length,
            totalPages: Math.ceil(drivers.length / limit)
          }
        };
      })
    );
  }
}