import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { CloudModule } from '@ionic/cloud-angular';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicModule } from 'ionic-angular';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/map';

import { LustrumApp } from './app.component';
import { cloudSettings, ionicConfig } from './app.config';
import { providers } from './app.providers';

import { EventListPageModule } from '../pages/event-list/event-list.module';
import { TabsPageModule } from '../pages/tabs/tabs.module';
import { TutorialPageModule } from '../pages/tutorial/tutorial.module';

@NgModule({
  declarations: [LustrumApp],
  imports: [
    BrowserModule,
    HttpModule,
    CloudModule.forRoot(cloudSettings),
    IonicModule.forRoot(LustrumApp, ionicConfig),
    IonicStorageModule.forRoot(),

    /**
     * Initial pages are included as they should not be lazy loaded
     */
    EventListPageModule,
    TabsPageModule,
    TutorialPageModule
  ],
  bootstrap: [IonicApp],
  providers: providers
})
export class AppModule {}
