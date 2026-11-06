import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ParkingZone, ParkingZonePayload } from '../models/parking-zone.model';

@Injectable({
  providedIn: 'root'
})
export class ParkingZoneService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/parking-zones`;

  list(): Observable<ParkingZone[]> {
    return this.http.get<any>(this.base).pipe(
      map(res => {
        const data = res.data || res;
        if (Array.isArray(data)) return data;
        return data.parkingZones || data.parking_zones || data.items || [];
      })
    );
  }

  create(payload: ParkingZonePayload): Observable<ParkingZone> {
    return this.http.post<any>(this.base, payload).pipe(
      map(res => {
        const data = res.data || res;
        return data.parkingZone || data.parking_zone || data;
      })
    );
  }

  update(id: number, payload: Partial<ParkingZonePayload>): Observable<ParkingZone> {
    return this.http.patch<any>(`${this.base}/${id}`, payload).pipe(
      map(res => {
        const data = res.data || res;
        return data.parkingZone || data.parking_zone || data;
      })
    );
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }
}