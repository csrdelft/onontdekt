import { Component, Renderer, ViewChild } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Content, IonicPage, NavController, Platform, Searchbar } from 'ionic-angular';

import { IMemberGroup, IMemberShort } from '../../models/member';
import { ApiData } from '../../providers/api-data';

@IonicPage()
@Component({
  templateUrl: 'member-list.html'
})
export class MemberListPage {
  @ViewChild(Content) content: Content;

  groups: IMemberGroup[] = [];
  queryText: string = '';
  lastQueryText: string = '';
  searching: boolean = false;
  searchFilteringActive: boolean = false;
  failedToLoad: boolean = false;

  constructor(
    private apiData: ApiData,
    private googleAnalytics: GoogleAnalytics,
    private navCtrl: NavController,
    private platform: Platform,
    private renderer: Renderer
  ) {
    apiData.getMemberList().then((members: IMemberShort[]) => {

      let grouped: { [key: string]: IMemberShort[] } = members.reduce(
        (result: { [key: string]: IMemberShort[] }, member) => {
          const key = member.achternaam.replace(/[a-z ']/g, '')[0];
          (result[key] = result[key] || []).push(member);
          return result;
        },
      {});

      let mapped = Object.keys(grouped).map(key => {
        return {
          char: key,
          members: grouped[key],
          hide: false
        };
      });

      this.groups = mapped;

      // Hide searchbar by default on iOS
      if (this.platform.is('ios')) {
        // Disable as it seems buggy
        // this.content.setScrollTop(44);
      }
    }, () => {
      this.failedToLoad = true;
    });
  }

  queryMembers() {
    let queryText: string = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    if (queryText === this.lastQueryText) return;

    if (this.queryText.length === 0) {
      setTimeout(() => {
        // Timeout to let animations finish
        this.searchFilteringActive = false;
      }, 300);
      return;
    }

    this.groups.forEach(group => {
      group.hide = true;
      group.members.forEach(member => {
        member.hide = false;
        let search = member.id + ' ' + member.voornaam + ' ';
        if (member.tussenvoegsel) {
          search += member.tussenvoegsel + ' ';
        }
        search += member.achternaam;
        if (search.toLowerCase().indexOf(queryText) === -1) {
          member.hide = true;
        } else {
          group.hide = false;
        }
      });
    });

    this.searchFilteringActive = true;
    this.lastQueryText = queryText;
  }

  startSearch(searchBar: Searchbar) {
    setTimeout(() => {
      this.searching = true;
      setTimeout(() => {
        let el = searchBar._searchbarInput.nativeElement;
        this.renderer.invokeElementMethod(el, 'focus', []);
      }, 0);
    }, 200);
  }

  stopSearch() {
    setTimeout(() => {
      this.searching = false;
    }, 200);
  }

  stopSearchSoft() {
    if (this.queryText.length === 0) {
      setTimeout(() => {
        this.searching = false;
      }, 200);
    }
  }

  goToMemberDetail(member: IMemberShort) {
    this.apiData.getMemberDetail(member.id).then(memberDetail => {
      this.navCtrl.push('MemberDetailPage', memberDetail);
    });
  }

  ionViewDidEnter() {
    if ((GoogleAnalytics as any)['installed']()) {
      this.googleAnalytics.trackView('Member List');
    }
  }

}
