import { Component, inject, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { SharedService } from '../../shared/shared.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { count, take } from 'rxjs';
import { User } from '../../shared/models/account/user.model';
import { ConfirmEmail } from '../../shared/models/account/confirm-email.model';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent implements OnInit{
  success = true;

  accountService = inject(AccountService);
  sharedService = inject(SharedService);
  router = inject(Router);
  activeRoute = inject(ActivatedRoute);
  
  ngOnInit(): void {
    this.accountService.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if(user) {
          this.router.navigate(['/']);
        } else {
          this.activeRoute.queryParamMap.subscribe({
            next: (params: ParamMap) => {
              const confirmEmail: ConfirmEmail = {
                email: params.get('email') || '',
                token: params.get('token') || '',
              }

              this.accountService.confirmEmail(confirmEmail).subscribe({
                next: (response: any) => {
                  this.sharedService.showNotification(true, response.value.title, response.value.message);
                  this.router.navigate(['/account/login']);
                },
                error: (err) => {
                  this.success = false;
                  this.sharedService.showNotification(false, 'Lỗi', err.error);
                },
              });
            },
          });
        }
      },
    });
  }

  resendEmailConfirmLink() {
    this.router.navigateByUrl('/account/send-email/resend-email-confirmation-link');
  }

}