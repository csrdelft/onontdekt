import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { EventListPage } from '../event-list/event-list';
import { MemberListPage } from '../member-list/member-list';
import { MapPage } from '../map/map';
import { AboutPage } from '../about/about';


@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  tab1Root = EventListPage;
  tab2Root = MemberListPage;
  tab3Root = MapPage;
  tab4Root = AboutPage;

  constructor(
    private platform: Platform
  ) {}

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      StatusBar.styleLightContent();
    });
  }
}
