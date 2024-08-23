import { Component, inject, OnInit } from '@angular/core';
import { Member } from '../../shared/models/user/member.model';
import { AccountService } from '../../account/account.service';
import { MemberService } from '../member.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.scss'
})
export class MemberEditComponent implements OnInit{
  member!: Member;

  private accountService = inject(AccountService);
  private memberService = inject(MemberService);

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    this.accountService.user$.pipe(take(1)).subscribe({

    });
  }

}
