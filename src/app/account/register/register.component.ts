import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
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
  maxDate = new Date();

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
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ['',[Validators.required, Validators.minLength(3),Validators.maxLength(15)]],
      lastName: ['',[Validators.required, Validators.minLength(3),Validators.maxLength(15)]],
      knowAs: ['',[Validators.required]],
      email: ['',[Validators.required, Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]],
      dateOfBirth: ['', Validators.required],
      gender: ['male'],
      password: ['',[Validators.required, Validators.minLength(6),Validators.maxLength(15)]],
      confirmPassword: ['',[Validators.required, this.matchValues('password')]],
    });

    this.registerForm.controls['password'].valueChanges.subscribe({
      next: _ => this.registerForm.controls['confirmPassword'].updateValueAndValidity(),
    });
  }

  matchValues(mathTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(mathTo)?.value ? null : {isMatching: true};
    }
  }

  register() {
    this.submitted = true;
    this.errorMessage = [];
    console.log('chay vao day');
    

    const dob = this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);
    this.registerForm.patchValue({dateOfBirth: dob});
    console.log(dob);
    console.log('dung o day chang???');
    
    if(this.registerForm.valid) {
      console.log('co valid khong??');
      this.accountService.register(this.registerForm.value).subscribe({
        next: (response: any) => {
          console.log(response);
          console.log('chay vao day 2');
          
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

  private getDateOnly(dob: string | undefined) {
    if (!dob) return;
    return new Date(dob).toISOString().slice(0, 10);
  } 

}
