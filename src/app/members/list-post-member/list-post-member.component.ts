import { CommonModule } from '@angular/common';
import { Component, inject, Input, input, OnInit } from '@angular/core';
import { MemberService } from '../member.service';
import { Member } from '../../shared/models/user/member.model';
import { PostResponse } from '../../shared/models/user/post-response.model';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { AccountService } from '../../account/account.service';
import { TimeagoModule } from 'ngx-timeago';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { EditPostMemberComponent } from '../edit-post-member/edit-post-member.component';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-list-post-member',
  templateUrl: './list-post-member.component.html',
  styleUrls: ['./list-post-member.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    GalleryModule,
    TimeagoModule,
    ModalModule,
  ]
})
export class ListPostMemberComponent implements OnInit {
  private memberService = inject(MemberService);
  private accountService = inject(AccountService);
  private modalService = inject(BsModalService);
  private sharedService = inject(SharedService);
  bsModalRef?: BsModalRef;
  @Input() photoTab: any;

  listPostMember: PostResponse[] = []; // Always initialized to an empty array
  @Input() member!: Member | null;

  imageUrl: string = '';
  knowsAs: string = '';
  isLoading: boolean = true;

  imagesByPost = new Map<number, GalleryItem[]>();

  ngOnInit(): void {
    this.getPostByMember();
  }

  getPostByMember() {
    const memberId = this.member?.id || this.accountService.user$()!.id;
    this.memberService.getPostId(memberId).subscribe({
      next: (res: PostResponse[]) => {
        this.listPostMember = res || []; // Ensure it's an array
        this.isLoading = false; // Set loading to false once data is fetched
        if (this.listPostMember) {
          this.listPostMember.forEach(post => {
            const galleryItems = post.photos.map(photo => new ImageItem({ src: photo.url, thumb: photo.url }));
            this.imagesByPost.set(post.id, galleryItems);
          });
        }
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        this.isLoading = false; // Ensure loading is set to false even on error
      }
    });
  }
  
  deletePost(postId: number): void {
    this.sharedService.showNotification(
      false,
      'Confirm',
      'Are you sure you want to delete this post?'
    ).subscribe((confirmed: boolean) => {
      console.log('confirmed=', confirmed);

      if (confirmed) {
        this.memberService.deletePost(postId).subscribe({
          next: (res: any) => {
            this.listPostMember = this.listPostMember.filter(post => post.id !== postId);
            this.sharedService.showNotification(true, 'Success', res.message);
          },
          error: err => {
            console.error('Error deleting post:', err);
            this.sharedService.showNotification(true, 'Error', err.error.error);
          }
        });
      }
    });
  }

  openEditPostModal(post: PostResponse): void {
    const initialState = {
      post: post
    };
    this.bsModalRef = this.modalService.show(EditPostMemberComponent, {
      class: 'modal-dialog-centered modal-lg',
      initialState: initialState
    });

    this.bsModalRef.content.postUpdated.subscribe((updatedPost: PostResponse) => {
      this.updatePostInList(updatedPost);
    });
  }

  updatePostInList(updatedPost: PostResponse): void {
    const index = this.listPostMember.findIndex(post => post.id === updatedPost.id);
    if (index !== -1) {
      this.listPostMember[index] = updatedPost; // Update the post in the list
      console.log('Post updated in list:', updatedPost);
    }
  }

  getPhotoMainCurrentUser() {
    this.imageUrl = this.accountService.user$()!.photoUrl;
    return this.imageUrl;
  }

  getKnowAsCurrentUser() {
    this.knowsAs = this.accountService.user$()!.knowAs;
    return this.knowsAs;
  }
}
