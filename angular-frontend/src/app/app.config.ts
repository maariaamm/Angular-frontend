import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter, withViewTransitions, withNavigationErrorHandler, Router } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http'

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions(), withNavigationErrorHandler((error) => {
      const router = inject(Router);
      console.log("Navigation error occurred:", error);
      router.navigate(['/'], {
        state: { errorMessage: error },
      });
    })),
    provideHttpClient(withFetch(),),
  ],
};
