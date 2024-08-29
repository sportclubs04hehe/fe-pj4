import { HttpInterceptorFn } from '@angular/common/http';
import { AccountService } from '../../account/account.service';
import { inject } from '@angular/core';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);

  const user = accountService.user$();

  if (user) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${user.jwt}`,
      },
    });
  }

  return next(req);
};