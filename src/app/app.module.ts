import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { IonicApp, IonicModule } from 'ionic-angular';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/withLatestFrom';

import { LustrumApp } from './app.component';
import { ionicConfig } from './app.config';
import { PROVIDERS } from './app.providers';

import { reducer } from '../state';
import { MemberEffects } from '../state/members/members.effects';
import { PostEffects } from '../state/posts/posts.effects';
import { TopicEffects } from '../state/topics/topics.effects';

import { COMPONENTS } from '../components';
import { DIRECTIVES } from '../directives';
import { PAGES } from '../pages';
import { PIPES } from '../pipes';

@NgModule({
  declarations: [
    LustrumApp,
    COMPONENTS,
    DIRECTIVES,
    PAGES,
    PIPES
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(LustrumApp, ionicConfig),
    IonicStorageModule.forRoot(),
    StoreModule.provideStore(reducer),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    EffectsModule.run(MemberEffects),
    EffectsModule.run(PostEffects),
    EffectsModule.run(TopicEffects)
  ],
  entryComponents: [
    LustrumApp,
    PAGES
  ],
  bootstrap: [IonicApp],
  providers: PROVIDERS
})
export class AppModule {}
