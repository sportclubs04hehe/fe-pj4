import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberListComponent } from './member-list/member-list.component';
import { SharedModule } from '../shared/shared.module';
import { MemberRoutingModule } from './member-routing.module';
import { MemberCardComponent } from './member-card/member-card.component';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { PhotoEditorComponent } from './photo-editor/photo-editor.component';


@NgModule({
  declarations: [
    MemberListComponent,
    MemberCardComponent,
    MemberEditComponent,
    PhotoEditorComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MemberRoutingModule,
  ]
})
export class MemberModule { }
