import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { IonicApp, IonicModule } from 'ionic-angular';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/withLatestFrom';

import { LustrumApp } from './app.component';
import { ionicConfig } from './app.config';
import { providers } from './app.providers';

import { EventListPageModule } from '../pages/event-list/event-list.module';
import { TabsPageModule } from '../pages/tabs/tabs.module';
import { TutorialPageModule } from '../pages/tutorial/tutorial.module';
import { reducer } from '../state';
import { MemberEffects } from '../state/members/members.effects';
import { TopicEffects } from '../state/topics/topics.effects';

@NgModule({
  declarations: [LustrumApp],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(LustrumApp, ionicConfig),
    IonicStorageModule.forRoot(),
    StoreModule.provideStore(reducer),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    EffectsModule.run(MemberEffects),
    EffectsModule.run(TopicEffects),

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
