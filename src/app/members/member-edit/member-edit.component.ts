import { Component, inject, OnInit } from '@angular/core';
import { Member } from '../../shared/models/user/member.model';
import { AccountService } from '../../account/account.service';
import { MemberService } from '../member.service';
import { User } from '../../shared/models/account/user.model';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.scss'
})
export class MemberEditComponent implements OnInit{
  member!: Member;
  user!: User;

  private accountService = inject(AccountService);
  private memberService = inject(MemberService);

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    const user = this.accountService.getCurrentUser();

    if(!user) return;

    this.memberService.getMember(user.userName).subscribe({
      next: (response: Member) => {
        this.member = response;
      }
    })
  }

}
