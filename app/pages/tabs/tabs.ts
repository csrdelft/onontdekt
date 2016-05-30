import { Page } from 'ionic-angular';

import { EventListPage } from '../event-list/event-list';
import { MemberListPage } from '../member-list/member-list';
import { MapPage } from '../map/map';
import { AboutPage } from '../about/about';


@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {
  tab1Root = EventListPage;
  tab2Root = MemberListPage;
  tab3Root = MapPage;
  tab4Root = AboutPage;

  constructor() {}
}
