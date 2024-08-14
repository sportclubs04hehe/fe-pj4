import { HttpInterceptorFn } from '@angular/common/http';
import { AccountService } from '../../account/account.service';
import { inject } from '@angular/core';
import { User } from '../models/account/user.model';
import { take } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);

  accountService.user$.pipe(take(1)).subscribe({
    next: (user: User | null) => {
      if(user) {
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${user.jwt}`,
          }
        });
      }
    },
  });
  
  return next(req);
};
