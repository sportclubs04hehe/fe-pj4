import { Component, computed, inject, input, OnInit } from '@angular/core';
import { Member } from '../../shared/models/user/member.model';
import { LikeService } from '../like.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss'
})
export class MemberCardComponent implements OnInit{
  private likeService = inject(LikeService);
  private toastr = inject(ToastrService);

  isHover = false;

  member = input.required<Member>();

  hasLiked = computed(() => this.likeService.likeIds().includes(this.member().id));

  constructor() {
    
  }

  ngOnInit(): void {
    
  }

  toggleLike() {
    this.likeService.toggleLike(this.member().id).subscribe({
      next: _ => {
        
        if(this.hasLiked()) {
          this.likeService.likeIds.update(ids => ids.filter(x => x !== this.member().id)); // bỏ
          this.toastr.success(`You have successfully unliked ${this.member().knowAs}!`);
        }
        else {
          this.likeService.likeIds.update(ids => [...ids, this.member().id]); // thả
          this.toastr.success(`You have added ${this.member().knowAs} to your favorites list ❤️`);
        }
      },
    })
  }

  hasLike(): boolean {
    return true;
  }

}
