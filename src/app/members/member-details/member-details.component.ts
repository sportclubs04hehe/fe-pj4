import { Component, inject, OnInit } from '@angular/core';
import { MemberService } from '../member.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Member } from '../../shared/models/user/member.model';
import { Gallery, GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { Photo } from '../../shared/models/user/photo.model';
import { LIGHTBOX_CONFIG, LightboxConfig, LightboxModule } from 'ng-gallery/lightbox';
import { CommonModule, NgFor } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TimeagoIntl, TimeagoModule } from 'ngx-timeago';

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
  galleryId = 'memberGallery';
  images: GalleryItem[] = [];

  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private gallery = inject(Gallery);

  member!: Member;

  ngOnInit(): void {
    this.loadMember();
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

  loadImages(photos: Photo[]) {
    this.images = photos.map(photo => new ImageItem({ src: photo.url, thumb: photo.url }));
    
    // Load images into gallery
    const galleryRef = this.gallery.ref(this.galleryId);
    galleryRef.load(this.images);
  }

  capitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
}
