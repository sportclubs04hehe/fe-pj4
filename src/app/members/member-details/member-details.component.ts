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
import { LikeService } from '../like.service';
import { Message } from '../../shared/models/message/message.model';
import { MessageService } from '../../message/message.service';

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

  galleryId = 'memberGallery';
  images: GalleryItem[] = [];
  like = 0;
  likedBy = 0;
  activeTabs?: TabDirective;
  message: Message[] = [];
  chatUserPhotoUrl: string = '';  // Ảnh đại diện của người đang trò chuyện
  chatUserName: string = '';      // Tên của người đang trò chuyện

  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private gallery = inject(Gallery);
  private likeService = inject(LikeService);
  private messageService = inject(MessageService);

  member!: Member;

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.member = data['member'];
        this.loadImages(this.member.photos);
      }
    })

    this.getLiked();
    this.getByLiked();

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab']);
      }
    })
  }

  loadMember() {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) return;

    this.memberService.getMember(username).subscribe({
      next: (value: Member) => {
        this.member = value;
        this.loadImages(value.photos);
      },
    });
  }

  onTabActivated(data: TabDirective) {
    this.activeTabs = data;
    if(this.activeTabs.heading === 'Message' && this.message.length === 0 && this.member) {
      this.messageService.getMessageThread(this.member.userName).subscribe({
        next: (response) => {
          if (response.length > 0) {
            const lastMessage = response[response.length - 1];
  
            // Xác định người đang trò chuyện: nếu username là người gửi thì lấy thông tin người nhận, ngược lại lấy thông tin người gửi
            if (this.member.userName !== lastMessage.senderUsername) {
              this.chatUserPhotoUrl = lastMessage.recipientPhotoUrl;
              this.chatUserName = lastMessage.recipientKnowAs;
            } else {
              this.chatUserPhotoUrl = lastMessage.senderPhotoUrl;
              this.chatUserName = lastMessage.senderKnowAs;
            }
          }else {
            // Nếu chưa có tin nhắn, gọi API lấy thông tin người dùng
            this.loadChatUserInfo();
          }
  
          this.message = response;
        },
      });
    }
  }

  getLiked() {
    this.likeService.getLikedCount(this.member.id).subscribe({
      next: (response: number) => {
        this.like = response;
      }
    });
  }

  getByLiked() {
    this.likeService.getLikedByCount(this.member.id).subscribe({
      next: (response: number) => {
        this.likedBy = response;
      }
    });
  }

  loadImages(photos: Photo[]) {
    this.images = photos.map(photo => new ImageItem({ src: photo.url, thumb: photo.url }));
    
    // Load images into gallery
    const galleryRef = this.gallery.ref(this.galleryId);
    galleryRef.load(this.images);
  }

  loadChatUserInfo() {
    this.memberService.getMember(this.member.userName).subscribe({
      next: (member) => {
        this.chatUserPhotoUrl = member.photoUrl || './assets/avatar.png';  // URL ảnh mặc định nếu không có
        this.chatUserName = member.knowAs;  // Lấy tên người dùng
      },
      error: (err) => {
        console.error('Lỗi khi lấy thông tin người dùng:', err);
      }
    });
  }

  onUpdateMessage(event: Message) {
    this.message.push(event);
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
