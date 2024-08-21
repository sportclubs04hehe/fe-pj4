import { Component, input } from '@angular/core';
import { Member } from '../../shared/models/user/member.model';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss'
})
export class MemberCardComponent {
  member = input.required<Member>();
}
