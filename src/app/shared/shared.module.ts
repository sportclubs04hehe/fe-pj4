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
import { ServerErrorComponent } from './erors/server-error/server-error.component';
import { TestErrorComponent } from './erors/test-error/test-error.component';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  declarations: [
    NotFoundComponent,
    ValidationMessageComponent,
    AutoFocusDirective,
    NotificationComponent,
    ServerErrorComponent,
    TestErrorComponent
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
    TabsModule.forRoot(),
  ],
  exports: [
    RouterModule,
    AutoFocusDirective,
    ReactiveFormsModule,
    HttpClientModule,
    ValidationMessageComponent,
    TabsModule,
  ]
})
export class SharedModule { }
