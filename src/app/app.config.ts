import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { credentialsInterceptor } from './core/interceptors/credentials.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { MessageService,ConfirmationService } from 'primeng/api';

const DocuFlowPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#e7f2fe',
      100: '#cee5fd',
      200: '#9dccfb',
      300: '#6cb2f9',
      400: '#3b99f7',
      500: '#0a7ff5',
      600: '#0866c4',
      700: '#064c93',
      800: '#043362',
      900: '#021931',
      950: '#011222'
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([credentialsInterceptor, errorInterceptor])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: DocuFlowPreset,
        options: {
          darkModeSelector: false
        }
      }
    }),
    MessageService,
    ConfirmationService
  ]
};