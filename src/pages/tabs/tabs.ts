import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { EventListPage } from '../event-list/event-list';
import { ForumRecentPage } from '../forum-recent/forum-recent';
import { MemberListPage } from '../member-list/member-list';
import { RankingPage } from '../ranking/ranking';
import { AboutPage } from '../about/about';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  eventListTab: any = EventListPage;
  forumTab: any = ForumRecentPage;
  memberListTab: any = MemberListPage;
  rankingTab: any = RankingPage;
  aboutTab: any = AboutPage;

  color: string;

  constructor(
    private platform: Platform
  ) {
    if (!this.platform.is('ios')) {
      this.color = 'primary';
    }
  }

  private ionViewDidEnter() {
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        StatusBar.styleLightContent();
      });
    }
  }
}
