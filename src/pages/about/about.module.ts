import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SystemBrowserDirectiveModule } from '../../directives/system-browser/system-browser.module';
import { AboutPage } from './about';

@NgModule({
  declarations: [
    AboutPage
  ],
  imports: [
    IonicPageModule.forChild(AboutPage),
    SystemBrowserDirectiveModule
  ]
})
export class AboutPageModule { }
