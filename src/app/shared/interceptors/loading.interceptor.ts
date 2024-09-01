import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SharedService } from '../shared.service';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const sharedService = inject(SharedService);

  console.log(`Interceptor kích hoạt cho: ${req.url}`);

  sharedService.busy();

  return next(req).pipe(
    delay(500),
    finalize(() => {
      sharedService.idle();
    }),
  );
};
