import { Component } from '@angular/core';
import { AccountService } from '../account/account.service';
import { NgIf } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PostComponent } from '../posts/post/post.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  bsModalRef?: BsModalRef;

  constructor(public accountService: AccountService,
    private modalService: BsModalService,
  ) {}

  logout() {
    this.accountService.logout();
  }

  openPostModal(): void {
    this.bsModalRef = this.modalService.show(PostComponent, {
      class: 'modal-dialog-centered'
    });
  }

}
