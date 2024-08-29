import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import { User } from '../../shared/models/account/user.model';
import { take } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm!: FormGroup;
  submitted = false;
  errorMessage: string[] = [];

  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private router: Router,
    private toastr: ToastrService,
  ) {

    const user = accountService.user$();

    if (user) {
      this.router.navigate(['/members/member-lists']);
    }

  }
  
  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ['',[Validators.required, Validators.minLength(3),Validators.maxLength(15)]],
      lastName: ['',[Validators.required, Validators.minLength(3),Validators.maxLength(15)]],
      email: ['',[Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]],
      password: ['',[Validators.required, Validators.minLength(6),Validators.maxLength(15)]],
    })
  }

  register() {
    this.submitted = true;
    this.errorMessage = [];

    if(this.registerForm.valid) {
      this.accountService.register(this.registerForm.value).subscribe({
        next: (response: any) => {
          this.sharedService.showNotification(true, response.value.title, response.value.message);
          this.router.navigateByUrl('/account/login');
        },
        error: (error) => {
          if(error.error.errors) {
            this.errorMessage = error.error.errors;
            this.toastr.error(error.error.errors);
          } 
          else {
            this.errorMessage.push(error.error);
            this.toastr.error(error.error);
          }
        },
        complete: () => {
          this.toastr.success('Đăng ký thành công, hãy xác nhận email trước khi đăng nhập!')
        }
      });
    }
  }

}
