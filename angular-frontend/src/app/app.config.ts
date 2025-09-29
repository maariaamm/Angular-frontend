import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter, withViewTransitions, withNavigationErrorHandler, Router, withRouterConfig } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http'

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions(), withRouterConfig({onSameUrlNavigation: 'reload' }),withNavigationErrorHandler((error) => {
      const router = inject(Router);
      router.navigate(['/'], {
        state: { errorMessage: error },
      });
    })),
    provideHttpClient(withFetch(),),
  ],
};
