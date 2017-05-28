import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

import { AboutPage } from '../about/about';
import { EventListPage } from '../event-list/event-list';
import { ForumRecentPage } from '../forum-recent/forum-recent';
import { MemberListPage } from '../member-list/member-list';
import { RankingPage } from '../ranking/ranking';

@Component({
  selector: 'csr-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  eventListTab = EventListPage;
  forumTab = ForumRecentPage;
  memberListTab = MemberListPage;
  rankingTab = RankingPage;
  aboutTab = AboutPage;

  color: string;

  constructor(
    private platform: Platform
  ) {
    if (!this.platform.is('ios')) {
      this.color = 'primary';
    }
  }
}
