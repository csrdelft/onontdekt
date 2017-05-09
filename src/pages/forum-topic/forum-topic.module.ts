import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ForumMessageComponentModule } from '../../components/forum-message/forum-message.module';
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
    DateCalendarPipeModule,
    ForumMessageComponentModule
  ]
})
export class ForumTopicPageModule { }
