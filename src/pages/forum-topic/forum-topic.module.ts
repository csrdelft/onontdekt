import { NgModule } from '@angular/core';
import { MomentModule } from 'angular2-moment';
import { IonicPageModule } from 'ionic-angular';

import { BBParsePipeModule } from '../../pipes/bb-parse/bb-parse.module';
import { ForumTopicPage } from './forum-topic';

@NgModule({
  declarations: [
    ForumTopicPage
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(ForumTopicPage),
    BBParsePipeModule
  ]
})
export class ForumTopicPageModule { }
