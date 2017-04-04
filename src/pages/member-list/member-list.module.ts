import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { GroupByPipeModule } from '../../pipes/group-by/group-by.module';
import { MemberListPage } from './member-list';

@NgModule({
  declarations: [
    MemberListPage
  ],
  imports: [
    IonicPageModule.forChild(MemberListPage),
    GroupByPipeModule
  ]
})
export class MemberListPageModule { }
