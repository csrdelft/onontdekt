import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { BBStripPipeModule } from '../../pipes/bb-strip/bb-strip.module';
import { DateCalendarPipeModule } from '../../pipes/date-calendar/date-calendar.module';
import { ForumRecentPage } from './forum-recent';

@NgModule({
  declarations: [
    ForumRecentPage
  ],
  imports: [
    IonicPageModule.forChild(ForumRecentPage),
    BBStripPipeModule,
    DateCalendarPipeModule
  ]
})
export class ForumRecentPageModule { }
