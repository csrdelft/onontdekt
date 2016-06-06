import { Component, Renderer } from '@angular/core';
import { NavController } from 'ionic-angular';
import * as _ from 'lodash';

import { ApiData } from '../../services/api-data';
import { MemberDetailPage } from '../member-detail/member-detail';


interface MemberShort {
  id: number;
  voornaam: string;
  tussenvoegsel: string;
  achternaam: string;
  hide: boolean;
};

interface MemberGroup {
  char: string;
  members: MemberShort[];
  hide: boolean;
};

@Component({
  templateUrl: 'build/pages/member-list/member-list.html'
})
export class MemberListPage {
  groups: MemberGroup[] = [];
  queryText: string = '';
  lastQueryText: string = '';
  searching: boolean = false;
  searchFilteringActive: boolean = false;
  failedToLoad: boolean = false;

  constructor(
    private apiData: ApiData,
    private nav: NavController,
    private renderer: Renderer
  ) {
    apiData.getMemberList().then(members => {
      let grouped = _.groupBy(members, c => c.achternaam.replace(/[a-z ']/g, '')[0]);
      let mapped = _.map(grouped, (value, key) => {
        return {
          'char': key,
          'members': value,
          'hide': false
        };
      });
      this.groups = mapped;
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

  startSearch(searchInput) {
    setTimeout(() => {
      this.searching = true;
      setTimeout(() => {
        let inputElement = searchInput.inputElement;
        this.renderer.invokeElementMethod(inputElement, 'focus', []);
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

  goToMemberDetail(member: MemberShort) {
    this.apiData.getMemberDetail(member.id).then(memberDetail => {
      this.nav.push(MemberDetailPage, memberDetail);
    });
  }

}
