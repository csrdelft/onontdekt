import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { MapsHrefDirectiveModule } from '../../directives/maps-href/maps-href.module';
import { EventDetailPage } from './event-detail';

@NgModule({
  declarations: [
    EventDetailPage
  ],
  imports: [
    IonicPageModule.forChild(EventDetailPage),
    MapsHrefDirectiveModule
  ]
})
export class EventDetailPageModule { }
