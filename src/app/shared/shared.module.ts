import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './erors/not-found/not-found.component';
import { ValidationMessageComponent } from './erors/validation-message/validation-message.component';
import { NotificationComponent } from './modals/notification/notification.component';
import { AutoFocusDirective } from './auto-focus.directive';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    NotFoundComponent,
    ValidationMessageComponent,
    AutoFocusDirective,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      timeOut: 3000,
      preventDuplicates: true,
    }),
  ],
  exports: [
    RouterModule,
    AutoFocusDirective,
    ReactiveFormsModule,
    HttpClientModule,
    ValidationMessageComponent,
  ]
})
export class SharedModule { }
