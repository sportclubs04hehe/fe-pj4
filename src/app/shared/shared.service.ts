import { inject, Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { NotificationComponent } from './modals/notification/notification.component';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  api = environment.appUrl;
  http = inject(HttpClient);

  bsModalRef?: BsModalRef;

  constructor(private modalService: BsModalService) { }

  showNotification(isSuccess: boolean, title: string, message: string) {
    const initialState: ModalOptions = {
      initialState: {
        isSuccess,
        title,
        message,
      }
    };

    this.bsModalRef = this.modalService.show(NotificationComponent, initialState);
  }

  get401Error() {
    return this.http.get(`${this.api}/buggy/auth`);
  }

  get400Error() {
    return this.http.get(`${this.api}/buggy/bad-request`);
  }

  get500Error() {
    return this.http.get(`${this.api}/buggy/server-error`);
  }

  get404Error() {
    return this.http.get(`${this.api}/buggy/not-found`);
  }

}
