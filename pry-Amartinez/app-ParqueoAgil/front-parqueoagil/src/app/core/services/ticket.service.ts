import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Ticket, TicketPayload } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/tickets`;

  list(): Observable<Ticket[]> {
    return this.http.get<any>(this.base).pipe(
      map(res => {
        const data = res.data || res;
        if (Array.isArray(data)) return data;
        return data.tickets || data.items || [];
      })
    );
  }

  create(payload: TicketPayload): Observable<Ticket> {
    return this.http.post<any>(this.base, payload).pipe(
      map(res => {
        const data = res.data || res;
        return data.ticket || data;
      })
    );
  }

  close(id: number): Observable<Ticket> {
    return this.http.post<any>(`${this.base}/${id}/close`, {}).pipe(
      map(res => {
        const data = res.data || res;
        return data.ticket || data;
      })
    );
  }
}