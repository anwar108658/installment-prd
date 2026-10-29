import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';


import { APP_INITIALIZER, inject } from '@angular/core';
import { AuthService } from './app/core/services/authService/authservice';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => { const a = inject(AuthService); return () => a.init(); },
    },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()), provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
});
