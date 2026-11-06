import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VehicleType, VehicleTypePayload } from '../models/vehicle-type.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleTypeService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/vehicle-types`;

      list(): Observable<VehicleType[]> {
    console.log('🚀 Haciendo GET a:', this.base); // Para ver si se dispara
    return this.http.get<any>(this.base)
      .pipe(
        map(res => {
          console.log('📦 Respuesta del backend:', res); // Para ver qué llega
          const data = res.data || res;
          if (Array.isArray(data)) return data;
          return data.vehicleTypes || data.vehicle_types || data.items || [];
        })
      );
  }

  create(payload: VehicleTypePayload): Observable<VehicleType> {
    return this.http.post<any>(this.base, payload)
      .pipe(
        map(res => {
          const data = res.data || res;
          return data.vehicleType || data.vehicle_type || data.type || data;
        })
      );
  }

   update(id: number, payload: Partial<VehicleTypePayload>): Observable<VehicleType> {
    return this.http.patch<any>(`${this.base}/${id}`, payload)
      .pipe(
        map(res => {
          const data = res.data || res;
          return data.vehicleType || data.vehicle_type || data.type || data;
        })
      );
  }

    deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }
}