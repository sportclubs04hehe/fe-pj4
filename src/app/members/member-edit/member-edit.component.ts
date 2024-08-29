import { Component, inject, OnInit } from '@angular/core';
import { Member } from '../../shared/models/user/member.model';
import { AccountService } from '../../account/account.service';
import { MemberService } from '../member.service';
import { User } from '../../shared/models/account/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.scss',
})
export class MemberEditComponent implements OnInit {
  member!: Member;
  user!: User;
  editForm!: FormGroup;

  private accountService = inject(AccountService);
  private memberService = inject(MemberService);
  private toasrt = inject(ToastrService);
  private formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.initializeForm();
    this.loadMember();
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

    if (!user) return;

    this.memberService.getMember(user.userName).subscribe({
      next: (response: Member) => {
        this.member = response;
        if (this.editForm) {
          this.editForm.patchValue(this.member); // Patch the form with member data
        }
      },
    });
  }

  updateMember() {
    if (this.editForm.valid) {
      this.memberService.updateMember(this.editForm.value).subscribe({
        next: (_) => {
          this.toasrt.success('Cập nhật thành công');
          this.editForm.markAsPristine();
        },
      });
    }
  }

  onMemberChange(event: Member) {
    this.member = event;
  }
}
