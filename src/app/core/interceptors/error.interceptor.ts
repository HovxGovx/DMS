import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStateService } from '../auth-state.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authState = inject(AuthStateService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 || error.status === 403) {
        authState.markLoggedOut();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};