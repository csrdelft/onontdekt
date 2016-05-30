import { Renderer } from '@angular/core';
import { NavController, Page } from 'ionic-angular';
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

@Page({
  templateUrl: 'build/pages/member-list/member-list.html'
})
export class MemberListPage {
  groups: MemberGroup[] = [];
  queryText: string = '';
  searching: boolean = false;
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
    let queryText = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');

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
  }

  nonHidden(members: MemberShort[]) {
    return _.filter(members, m => !m.hide);
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
