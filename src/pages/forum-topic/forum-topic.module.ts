import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { BBParsePipeModule } from '../../pipes/bb-parse/bb-parse.module';
import { DateCalendarPipeModule } from '../../pipes/date-calendar/date-calendar.module';
import { ForumTopicPage } from './forum-topic';

@NgModule({
  declarations: [
    ForumTopicPage
  ],
  imports: [
    IonicPageModule.forChild(ForumTopicPage),
    BBParsePipeModule,
    DateCalendarPipeModule
  ]
})
export class ForumTopicPageModule { }
