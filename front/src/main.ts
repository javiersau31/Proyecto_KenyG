import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS
} from '@angular/common/http';

import { appRoutes } from './app/app.routes';

import { AuthInterceptor } from './app/auth/auth.interceptor';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [

    provideToastr(),

    importProvidersFrom(BrowserAnimationsModule),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

    provideHttpClient(
      withInterceptorsFromDi()
    ),

    provideRouter(appRoutes)

  ]
});