import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { MemberListPage } from './member-list';

@NgModule({
  declarations: [
    MemberListPage
  ],
  imports: [
    IonicPageModule.forChild(MemberListPage)
  ]
})
export class MemberListPageModule { }
