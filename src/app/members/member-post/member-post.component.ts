import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DemoNgZorroAntdModule } from '../../ng-zorro-antd.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MemberService } from '../member.service';
import { AccountService } from '../../account/account.service';
import { AutoFocusDirective } from '../../shared/auto-focus.directive';
import { SharedModule } from '../../shared/shared.module';
import { ImagePreviewModalComponent } from '../../shared/modals/image-preview-modal/image-preview-modal.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-post',
  templateUrl: './member-post.component.html',
  styleUrl: './member-post.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    DemoNgZorroAntdModule,
    ScrollingModule,
    DragDropModule,
    NzUploadModule,
    ReactiveFormsModule,
    TitleCasePipe,
    SharedModule
  ]
})
export class MemberPostComponent {
  postForm!: FormGroup;
  fileList: NzUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;

  constructor(public bsModalRef: BsModalRef,
    private memberService: MemberService,
    public accountService: AccountService,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private route: Router,
    private toastr: ToastrService
  ) {
    this.postForm = this.fb.group({
      content: ['']
    });
  }

  // Hàm xem trước ảnh
  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await this.getBase64(file.originFileObj!);
    }

    const initialState = {
      imageSrc: file.url || file['preview'],
    };

    this.bsModalRef = this.modalService.show(ImagePreviewModalComponent, { initialState, class: 'modal-dialog-centered' });
  };

  getBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  submitPost() {
    if (this.postForm.invalid) {
      console.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const { content } = this.postForm.value;
    const files = this.fileList
      .map(file => file.originFileObj)
      .filter((file): file is File => !!file);

    this.memberService.createPost({ content }, files).subscribe({
      next: (res: any) => {
        console.log('res post', res);

        this.postForm.reset();
        this.fileList = [];
        this.closeModal();
        this.route.navigate(['/members/edit']);
        this.toastr.success(res.message);
      }
    });
  }

  transformFile = (file: NzUploadFile): NzUploadFile => {
    return file;
  };

  closeModal(): void {
    this.bsModalRef.hide();
  }

  getPlaceholder(): string {
    const knowAs = this.accountService.user$()?.knowAs || '';
    const capitalizedKnowAs = knowAs.charAt(0).toUpperCase() + knowAs.slice(1);
    return `Hey ${capitalizedKnowAs}, what are you thinking?`;
  }
}
