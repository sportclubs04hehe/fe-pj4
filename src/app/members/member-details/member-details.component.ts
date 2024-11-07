import { Component, computed, inject, OnInit, ViewChild } from '@angular/core';
import { MemberService } from '../member.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Member } from '../../shared/models/user/member.model';
import { Gallery, GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { Photo } from '../../shared/models/user/photo.model';
import { LIGHTBOX_CONFIG, LightboxConfig, LightboxModule } from 'ng-gallery/lightbox';
import { CommonModule, NgFor } from '@angular/common';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { TimeagoIntl, TimeagoModule } from 'ngx-timeago';
import { MemberMessageComponent } from '../member-message/member-message.component';
import { Message } from '../../shared/models/message/message.model';
import { Friendships, FriendshipStatus } from '../../shared/models/user/friendships.model';
import { ListPostMemberComponent } from '../list-post-member/list-post-member.component';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrl: './member-details.component.scss',
  standalone: true,
  imports: [
    LightboxModule,
    GalleryModule,
    NgFor,
    TabsModule,
    CommonModule,
    RouterLink,
    TimeagoModule,
    MemberMessageComponent,
    ListPostMemberComponent
  ],
  providers:[
    {
      provide: LIGHTBOX_CONFIG,
      useValue: {
        keyboardShortcuts: false,
        exitAnimationTime: 1000,

      } as LightboxConfig
    }
  ]
})
export class MemberDetailsComponent implements OnInit{
  @ViewChild('memberTabs', {static: true}) memberTabs?: TabsetComponent;
  @ViewChild('photoTab', { static: true }) photoTab?: TabDirective;

  galleryId = 'memberGallery';
  images: GalleryItem[] = [];
  activeTabs?: TabDirective;
  message: Message[] = [];
  chatUserPhotoUrl: string = '';  // Ảnh đại diện của người đang trò chuyện
  chatUserName: string = '';      // Tên của người đang trò chuyện

  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private gallery = inject(Gallery);
  public FriendshipStatus = FriendshipStatus;

  member!: Member;
  friendshipStatus: FriendshipStatus | null = null; 

  constructor(){
  }

  ngOnInit(): void {
    // Lấy dữ liệu member từ route resolver
    this.route.data.subscribe({
      next: data => {
        this.member = data['member'];
        this.loadImages(this.member.photos);
  
        // Sau khi có member, lấy trạng thái kết bạn
        this.memberService.getFriendshipStatus(this.member.id).subscribe({
          next: (status: Friendships) => {
            if (status !== null) {
              this.friendshipStatus = status.status;
            }
          },
          error: () => {
            console.error('Failed to get friendship status');
          }
        });
      }
    });
  
    // Kiểm tra query params để điều hướng tab nếu có
    this.route.queryParams.subscribe({
      next: params => {
        if (params['tab']) {
          this.selectTab(params['tab']);
        }
      }
    });
  }  

  onTabActivated(data: TabDirective) {
    this.activeTabs = data;
    if(this.activeTabs.heading === 'Message' && this.message.length === 0 && this.member) {
    }
  }

  loadImages(photos: Photo[] | null | undefined) {
    if (photos && photos.length > 0) {
      this.images = photos.map(photo => new ImageItem({ src: photo.url, thumb: photo.url }));

      const galleryRef = this.gallery.ref(this.galleryId);
      galleryRef.load(this.images);
    } else {
      this.images = [];
    }
  }

  selectTab(heading: string) {
    if(this.memberTabs) {
      const messageTab = this.memberTabs.tabs.find(x => x.heading === heading);
      if(messageTab) messageTab.active = true;
    }
  }

  capitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

}
