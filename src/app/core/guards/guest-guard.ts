import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const guestGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return (async () => {
    await authService.waitForAuthInitialization();

    if (!authService.currentUser()) {
      return true;
    }

    return router.parseUrl('/library');
  })();
};
