import { Component, inject, OnInit } from '@angular/core';
import { MemberService } from '../member.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss'
})
export class MemberListComponent implements OnInit{
  memberService = inject(MemberService);

  genderList = [
    {value: 'male', display: 'Nam'},
    {value: 'female', display: 'Nữ'},
   ];

  ngOnInit(): void {
    if(!this.memberService.paginatedResult()) {
      this.loadMember();
    }
  }

  loadMember() {
    this.memberService.loadMembers();
  }

  resetFilter() {
    this.memberService.resetUserParams();
    this.loadMember();
  }

  pageChanged(event: PageChangedEvent) {
    if(this.memberService.userParams().pageNumber !== event.page) {
      this.memberService.userParams().pageNumber = event.page;
      this.loadMember();
    }
  }
}
