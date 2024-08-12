import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {
  isSuccess = true;
  title = '';
  message = '';

  constructor(public bsModalRef: BsModalRef) {

  }
}
