import { Component } from '@angular/core';

import { EventListPage } from '../event-list/event-list';
import { ForumRecentPage } from '../forum-recent/forum-recent';
import { MemberListPage } from '../member-list/member-list';

@Component({
  selector: 'csr-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  eventListTab = EventListPage;
  forumTab = ForumRecentPage;
  memberListTab = MemberListPage;
}
