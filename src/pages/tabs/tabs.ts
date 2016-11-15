import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { EventListPage } from '../event-list/event-list';
import { MemberListPage } from '../member-list/member-list';
import { RankingPage } from '../ranking/ranking';
import { AboutPage } from '../about/about';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = EventListPage;
  tab2Root: any = MemberListPage;
  tab3Root: any = RankingPage;
  tab4Root: any = AboutPage;

  constructor(
    private platform: Platform
  ) {}

  private ionViewDidEnter() {
    this.platform.ready().then(() => {
      StatusBar.styleLightContent();
    });
  }
}
