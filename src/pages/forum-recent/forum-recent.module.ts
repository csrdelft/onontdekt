import { NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { IonicPageModule } from 'ionic-angular';

import { BBStripPipeModule } from '../../pipes/bb-strip/bb-strip.module';
import { ForumRecentPage } from './forum-recent';

@NgModule({
  declarations: [
    ForumRecentPage
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(ForumRecentPage),
    BBStripPipeModule
  ]
})
export class ForumRecentPageModule { }
