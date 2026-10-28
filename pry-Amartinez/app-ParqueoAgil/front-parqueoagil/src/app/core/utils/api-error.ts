import { HttpErrorResponse } from '@angular/common/http';

export function toApiMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return 'No se pudo conectar con el backend. Verifica que NestJS esté corriendo en el puerto 3003.';
    }
    const body = error.error;
    if (body && body.message) {
      return Array.isArray(body.message) ? body.message.join(', ') : body.message;
    }
    return error.message;
  }
  return 'Error inesperado';
}