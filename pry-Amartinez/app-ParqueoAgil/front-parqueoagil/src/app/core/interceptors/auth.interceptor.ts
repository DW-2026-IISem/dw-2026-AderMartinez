import { HttpInterceptorFn } from '@angular/common/http';
import { timeout } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');

  let clonedReq = req;
  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Añadimos un timeout de 20 segundos
  return next(clonedReq).pipe(
    timeout(20000) 
  );
};