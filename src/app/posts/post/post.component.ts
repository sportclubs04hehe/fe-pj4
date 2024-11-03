import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  postContent = '';

  constructor(public bsModalRef: BsModalRef) {}

  closeModal(): void {
    this.bsModalRef.hide();
  }

  submitPost(): void {
    // Xử lý đăng bài
    console.log('Nội dung bài viết:', this.postContent);
    this.closeModal();
  }
}
