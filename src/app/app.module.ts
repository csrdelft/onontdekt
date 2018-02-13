import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { IonicApp, IonicModule } from 'ionic-angular';

import { CSRApp } from './app.component';
import { ionicConfig } from './app.config';
import { PROVIDERS } from './app.providers';

import { reducers } from '../state';
import { AuthEffects } from '../state/auth/auth.effects';
import { MemberEffects } from '../state/members/members.effects';
import { PostEffects } from '../state/posts/posts.effects';
import { TopicEffects } from '../state/topics/topics.effects';

import { COMPONENTS } from '../components';
import { DIRECTIVES } from '../directives';
import { PAGES } from '../pages';
import { PIPES } from '../pipes';

@NgModule({
  declarations: [CSRApp, COMPONENTS, DIRECTIVES, PAGES, PIPES],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(CSRApp, ionicConfig),
    IonicStorageModule.forRoot(),
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot([
      AuthEffects,
      MemberEffects,
      PostEffects,
      TopicEffects
    ])
  ],
  entryComponents: [CSRApp, PAGES],
  bootstrap: [IonicApp],
  providers: PROVIDERS
})
export class AppModule {}
