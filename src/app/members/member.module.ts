import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberDetailsComponent } from './member-details/member-details.component';
import { MemberListComponent } from './member-list/member-list.component';
import { SharedModule } from '../shared/shared.module';
import { MemberRoutingModule } from './member-routing.module';
import { MemberCardComponent } from './member-card/member-card.component';



@NgModule({
  declarations: [
    MemberDetailsComponent,
    MemberListComponent,
    MemberCardComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MemberRoutingModule,
  ]
})
export class MemberModule { }
