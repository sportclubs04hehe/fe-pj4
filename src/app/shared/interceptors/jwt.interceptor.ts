import { HttpInterceptorFn } from '@angular/common/http';
import { AccountService } from '../../account/account.service';
import { inject } from '@angular/core';
import { User } from '../models/account/user.model';
import { switchMap, take } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);

  return accountService.user$.pipe(
    take(1),
    switchMap((user: User | null) => {
      if (user) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${user.jwt}`,
          },
        });
      }
      return next(req);
    })
  );
};