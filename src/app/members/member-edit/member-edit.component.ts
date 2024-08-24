import { Component, inject, OnInit } from '@angular/core';
import { Member } from '../../shared/models/user/member.model';
import { AccountService } from '../../account/account.service';
import { MemberService } from '../member.service';
import { User } from '../../shared/models/account/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.scss'
})
export class MemberEditComponent implements OnInit{
  member!: Member;
  user!: User;
  editForm!: FormGroup;
  submitted = false;
  errorMessage: string[] = [];

  private accountService = inject(AccountService);
  private memberService = inject(MemberService);
  private sharedService = inject(SharedService);
  private formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.loadMember();
    this.initializeForm();
  }

  initializeForm() {
    this.editForm = this.formBuilder.group({
      introduction: [''],
      lookingFor: [''],
      interests: [''],
      city: [''],
      country: [''],
    });
  }

  loadMember() {
    const user = this.accountService.getCurrentUser();

    if(!user) return;

    this.memberService.getMember(user.userName).subscribe({
      next: (response: Member) => {
        this.member = response;
        this.editForm.patchValue(this.member);
      }
    })
  }

  updateMember() {
    console.log(this.member);
    // this.sharedService.showNotification()
  }

}
