import { Component, inject, input, OnInit, output } from '@angular/core';
import { Member } from '../../shared/models/user/member.model';
import { AccountService } from '../../account/account.service';
import { FileUploader } from 'ng2-file-upload';
import { environment } from '../../../environments/environment.development';
import { MemberService } from '../member.service';
import { Photo } from '../../shared/models/user/photo.model';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.scss'
})
export class PhotoEditorComponent implements OnInit{
  private accountService = inject(AccountService);
  private memberService = inject(MemberService);
  member = input.required<Member>();
  uploader?: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.appUrl;
  memberChange = output<Member>();

  ngOnInit(): void {
    this.initializeUploader();
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe({
      next: _ => {
        const user = this.accountService.user$();
        
        if(user) {
          user.photoUrl = photo.url;
          this.accountService.setUser(user);
        }

        const updateMember = {...this.member()};

        updateMember.photoUrl = photo.url;

        updateMember.photos.forEach(p => {
            if(p.isMain) p.isMain = false;
            if(p.id === photo.id) p.isMain = true;
        });

        this.memberChange.emit(updateMember);
      },
    });
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + '/users/add-photo',
      authToken: 'Bearer ' + this.accountService.getCurrentUser()?.jwt,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, header) => {
       const photo = JSON.parse(response);
       const updatedMember = {...this.member()};
       updatedMember.photos.push(photo);
       this.memberChange.emit(updatedMember);
    }
  }
}
