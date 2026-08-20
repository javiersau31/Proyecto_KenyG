import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { HTTP_INTERCEPTORS} from '@angular/common/http';
import { AuthInterceptor } from '../app/auth/auth.interceptor'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),

    provideHttpClient(withInterceptorsFromDi()),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
};