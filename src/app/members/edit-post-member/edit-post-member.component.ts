import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { MemberService } from '../member.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PostResponse } from '../../shared/models/user/post-response.model';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { DemoNgZorroAntdModule } from '../../ng-zorro-antd.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from '../../shared/shared.module';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { AccountService } from '../../account/account.service';
import { ImagePreviewModalComponent } from '../../shared/modals/image-preview-modal/image-preview-modal.component';

@Component({
  selector: 'app-edit-post-member',
  templateUrl: './edit-post-member.component.html',
  styleUrl: './edit-post-member.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    DemoNgZorroAntdModule,
    ScrollingModule,
    DragDropModule,
    NzUploadModule,
    FormsModule,
    TitleCasePipe,
    SharedModule,
    ModalModule,
  ]
})
export class EditPostMemberComponent implements OnInit {
  @Input() post!: PostResponse;
  @Output() postUpdated = new EventEmitter<PostResponse>();
  updatedContent: string = '';
  fileList: NzUploadFile[] = []; // To manage uploaded files

  constructor(private bsModalRef: BsModalRef,
    public accountService: AccountService,
    private memberService: MemberService,
    private modalService: BsModalService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    if (this.post) {
      this.updatedContent = this.post.content;

      this.fileList = this.post.photos.map(photo => ({
        uid: photo.id.toString(),
        name: '',
        status: 'done',
        url: photo.url,
      }));
    }
  }


  updatePost(): void {
    const postId = this.post.id;
    const postRequest = { content: this.updatedContent };

    this.memberService.updatePost(postId, postRequest).subscribe({
      next: _ => {
        this.post.content = this.updatedContent;
        this.postUpdated.emit(this.post);
        this.closeModal();
        this.toastr.success('Update successfully');
      },
      error: (err) => {
        console.error('Error updating post:', err);
      }
    });
  }

  addPhotosToPost(): void {
    const postId = this.post.id;
    const files = this.fileList
      .map(file => file.originFileObj)
      .filter((file): file is File => !!file);
    this.memberService.addPhotosToPost(postId, files).subscribe({
      next: (response: PostResponse | null) => {
        if (response) {
          // Update the post with the new photos
          this.post = response;
          this.fileList = this.post.photos.map(photo => ({
            uid: photo.id.toString(),
            name: '',
            status: 'done',
            url: photo.url,
          }));
          this.postUpdated.emit(this.post);
        } else {
          console.error('Received null response from addPhotosToPost'); // Log if response is null
        }
      },
      error: (err) => {
        console.error('Error adding photos in component:', err); // Log the error
      }
    });
  }

  removePhoto(photoId: string): void {
    const postId = this.post.id;

    this.memberService.removePhotoFromPost(postId, photoId).subscribe({
      next: _ => {
        this.fileList = this.fileList.filter(file => file.uid !== photoId);
        this.post.photos = this.post.photos.filter(photo => photo.id.toString() !== photoId);
        this.postUpdated.emit(this.post);
        this.toastr.success('Photo removed successfully');
      },
      error: (err) => {
        console.error('Error removing photo:', err);
      }
    });
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [...this.fileList, file];
    return false;
  };

  // Hàm xem trước ảnh
  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await this.getBase64(file.originFileObj!);
    }

    const initialState = {
      imageSrc: file.url || file['preview'],
    };

    this.bsModalRef = this.modalService.show(ImagePreviewModalComponent, {
      initialState,
      class: 'modal-dialog-centered'
    });
  };

  // Method to convert file to base64
  getBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  closeModal(): void {
    this.bsModalRef.hide();
  }

  handleChange(info: { file: NzUploadFile }): void {
    if (info.file.status === 'done') {
      const uploadedFile: NzUploadFile = {
        uid: info.file.uid,
        name: info.file.name,
        status: 'done',
        url: info.file.response.url, // Ensure this is the correct URL from the response
        originFileObj: info.file.originFileObj,
      };

      // Update the fileList to include the uploaded file
      this.fileList = [...this.fileList, uploadedFile];
    } else if (info.file.status === 'error') {
      console.error(`${info.file.name} file upload failed.`);
    }
  }
  
}