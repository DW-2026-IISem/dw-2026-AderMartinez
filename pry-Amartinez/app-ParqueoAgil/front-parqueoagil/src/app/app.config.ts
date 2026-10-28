import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      },
      license: 'eyJpZCI6ImVmMzAyMzhkLThkMWItNDcwYi05ZWJkLWVhOGVlY2NjYzgyNSIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3OTI3MjI5MzQsImV4cCI6MTgyNDI1ODkzNH0.eia52CIFPQnNeHV9fNvSJPi2ED0ez_xopJZYtQmzFy8wZ_zefIjL9OZrszjiGtamKJt1h40OLcN5roGiZrtfAQ' // <-- Pon tu código entre las comillas
    }),
  ],
};