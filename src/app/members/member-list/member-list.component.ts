import { Component, inject, OnInit } from '@angular/core';
import { MemberService } from '../member.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss'
})
export class MemberListComponent implements OnInit{
  memberService = inject(MemberService);

  members = this.memberService.members;

  ngOnInit(): void {
    this.memberService.loadMembers();
  }
}
