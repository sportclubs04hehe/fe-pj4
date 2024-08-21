import { Component, inject, OnInit } from '@angular/core';
import { MemberService } from '../member.service';
import { Member } from '../../shared/models/user/member.model';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss'
})
export class MemberListComponent implements OnInit{
  private memberService = inject(MemberService);
  members: Member[] = [];

  ngOnInit(): void {
    this.loadMembers();
    
  }

  loadMembers() {
    this.memberService.getMembers().subscribe({
      next: (response: any) => {
        this.members = response;
      }
    })
  }

}
