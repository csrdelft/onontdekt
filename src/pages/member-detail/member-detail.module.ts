import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { MapsHrefDirectiveModule } from '../../directives/maps-href/maps-href.module';
import { DateFormatPipeModule } from '../../pipes/date-format/date-format.module';
import { MemberDetailPage } from './member-detail';

@NgModule({
  declarations: [
    MemberDetailPage
  ],
  imports: [
    IonicPageModule.forChild(MemberDetailPage),
    MapsHrefDirectiveModule,
    DateFormatPipeModule
  ]
})
export class MemberDetailPageModule { }
