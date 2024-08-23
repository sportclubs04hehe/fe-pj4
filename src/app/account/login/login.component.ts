import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { User } from '../../shared/models/account/user.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  errorMessage: string[] = [];
  returnUrl?: string;

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private router: Router,
    activeRoute: ActivatedRoute,
    private toastr: ToastrService,
  ) {
    accountService.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if (user) {
          this.router.navigate(['/members/member-lists']);
        } else {
          activeRoute.queryParamMap.subscribe({
            next: (params: any) => {
              if (params) {
                this.returnUrl = params.get('returnUrl');
              }
            },
          });
        }
      },
    });
  }
  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    this.submitted = true;
    this.errorMessage = [];

    if (this.loginForm.valid) {
      this.accountService.login(this.loginForm.value).subscribe({
        next: _ => {
          if(this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          }

          this.router.navigateByUrl('/members/member-lists');
        },
        error: (error) => {
          if (error.error.errors) {
            this.errorMessage = error.error.errors;
            this.toastr.error(error.error.errors);
          } else {
            this.errorMessage.push(error.error);
            this.toastr.error(error.error);
          }
        },
        complete: () => {
          this.toastr.success('Đăng nhập thành công');
        },
      });
    }
  }

  resendEmailConfirmLink() {
    this.router.navigateByUrl('/account/send-email/resend-email-confirmation-link');
  }


}
