import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';  // Continua sendo necessário no Angular 18


import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideEnvironmentNgxMask } from 'ngx-mask';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(),     provideHttpClient(withFetch()), provideEnvironmentNgxMask()
  ]
};
