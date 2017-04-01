import { Component } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicPage, Platform } from 'ionic-angular';

import { EventListPage } from '../event-list/event-list';

@IonicPage()
@Component({
  selector: 'tabs-page',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  eventListTab: any = EventListPage;
  forumTab: any = 'ForumRecentPage';
  memberListTab: any = 'MemberListPage';
  rankingTab: any = 'RankingPage';
  aboutTab: any = 'AboutPage';

  color: string;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar
  ) {
    if (!this.platform.is('ios')) {
      this.color = 'primary';
    }
  }

  public ionViewDidEnter() {
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        this.statusBar.styleLightContent();
      });
    }
  }
}
