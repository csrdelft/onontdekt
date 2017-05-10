import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ForumMessageComponentModule } from '../../components/forum-message/forum-message.module';
import { ForumTextPage } from './forum-text';

@NgModule({
  declarations: [
    ForumTextPage
  ],
  imports: [
    IonicPageModule.forChild(ForumTextPage),
    ForumMessageComponentModule
  ]
})
export class ForumTextPageModule { }
