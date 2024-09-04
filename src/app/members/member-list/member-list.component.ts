import { Component, inject, OnInit } from '@angular/core';
import { MemberService } from '../member.service';
import { AccountService } from '../../account/account.service';
import { UserParams } from '../../shared/models/account/user-params.model';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss'
})
export class MemberListComponent implements OnInit{
  accountService = inject(AccountService);
  memberService = inject(MemberService);
  userParams = new UserParams(this.accountService.getCurrentUser());

  ngOnInit(): void {
    this.memberService.loadMembers(this.userParams);
  }

  pageChanged(event: any) {
    if (this.userParams && this.userParams.pageNumber !== event.pageIndex + 1) {
      this.userParams.pageNumber = event.pageIndex + 1;
      // this.service.setUsersParams(this.userParams);
      this.memberService.loadMembers(this.userParams);
    }
  }
}
