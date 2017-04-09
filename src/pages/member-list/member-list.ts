import { ChangeDetectionStrategy, Component, OnInit, Renderer, ViewChild } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Store } from '@ngrx/store';
import { Content, IonicPage, NavController, Searchbar } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../../state';
import * as members from '../../state/members/members.actions';
import { Member } from '../../state/members/members.model';

@IonicPage({
  segment: 'leden'
})
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'member-list-page',
  templateUrl: 'member-list.html'
})
export class MemberListPage implements OnInit {
  @ViewChild(Content) content: Content;

  members$: Observable<Member[]>;
  searchQuery$: Observable<string>;
  searching$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private googleAnalytics: GoogleAnalytics,
    private navCtrl: NavController,
    private renderer: Renderer,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.members$ = this.store.select(fromRoot.getMembersQueryResults);
    this.searchQuery$ = this.store.select(fromRoot.getMembersQuery);
    this.load();
  }

  load() {
    this.store.dispatch(new members.LoadAllAction());
  }

  search(event: KeyboardEvent) {
    const query = (event.target as HTMLInputElement).value;
    this.store.dispatch(new members.SearchAction(query));
  }

  groupBy(member: Member) {
    return member.achternaam.replace(/[a-z ']/g, '')[0];
  }

  startSearch(searchBar: Searchbar) {
    setTimeout(() => {
      this.searching$.next(true);
      setTimeout(() => {
        const el = searchBar._searchbarInput.nativeElement;
        this.renderer.invokeElementMethod(el, 'focus', []);
      }, 0);
    }, 200);
  }

  stopSearch() {
    setTimeout(() => {
      this.searching$.next(false);
    }, 200);
  }

  stopSearchSoft() {
    this.searchQuery$.take(1).subscribe(query => {
      if (query.length === 0) {
        setTimeout(() => {
          this.searching$.next(false);
        }, 200);
      }
    });
  }

  goToMemberDetail(member: Member) {
    this.navCtrl.push('MemberDetailPage', {
      id: member.id
    });
  }

  ionViewDidEnter() {
    if ((GoogleAnalytics as any)['installed']()) {
      this.googleAnalytics.trackView('Member List');
    }
  }

}
