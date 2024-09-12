import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../shared/models/user/member.model';
import { LikeService } from '../like.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss'
})
export class MemberCardComponent{
  private likeService = inject(LikeService);

  isHover = false;

  member = input.required<Member>();

  hasLiked = computed(() => this.likeService.likeIds().includes(this.member().id));

  constructor() {
    
    
  }

  toggleLike() {
    this.likeService.toggleLike(this.member().id).subscribe({
      next: _ => {
        
        if(this.hasLiked()) {
          this.likeService.likeIds.update(ids => ids.filter(x => x !== this.member().id)); // bỏ
        }
        else {
          this.likeService.likeIds.update(ids => [...ids, this.member().id]); // thả
        }
      },
    })
  }

  hasLike(): boolean {
    return true;
  }

}
